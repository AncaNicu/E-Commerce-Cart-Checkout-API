using Xunit;
using Moq;
using EcommerceAPI.Services;
using EcommerceAPI.Repositories;
using EcommerceAPI.Models;
using Microsoft.Extensions.Configuration;

namespace EcommerceAPI.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IAuthRepository> _authRepositoryMock;
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _authRepositoryMock = new Mock<IAuthRepository>();

            var inMemorySettings = new Dictionary<string, string>
            {
                {"Jwt:Key", "abcdefghijklmnopqrstuvwxyz123456"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"}
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();

            _authService = new AuthService(
                _authRepositoryMock.Object,
                _configuration
            );
        }

        //=========================REGISTER TESTS
        [Fact]
        public void Register_EmptyName_ThrowsException()
        {
            var request = new RegisterRequest
            {
                Name = "",
                Email = "john@test.com",
                Password = "123456",
                ConfirmPassword = "123456"
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Register(request));

            Assert.Equal("Name is required", exception.Message);
        }

        [Fact]
        public void Register_EmptyEmail_ThrowsException()
        {
            var request = new RegisterRequest
            {
                Name = "John",
                Email = "",
                Password = "123456",
                ConfirmPassword = "123456"
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Register(request));

            Assert.Equal("Email is required", exception.Message);
        }

        [Fact]
        public void Register_EmptyPassword_ThrowsException()
        {
            var request = new RegisterRequest
            {
                Name = "John",
                Email = "john@test.com",
                Password = "",
                ConfirmPassword = ""
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Register(request));

            Assert.Equal("Password is required", exception.Message);
        }

        [Fact]
        public void Register_PasswordsDoNotMatch_ThrowsException()
        {
            var request = new RegisterRequest
            {
                Name = "John",
                Email = "john@test.com",
                Password = "123456",
                ConfirmPassword = "abcdef"
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Register(request));

            Assert.Equal("Passwords do not match", exception.Message);
        }

        [Fact]
        public void Register_EmailAlreadyExists_ThrowsException()
        {
            _authRepositoryMock
                .Setup(x => x.EmailExists("john@test.com"))
                .Returns(true);

            var request = new RegisterRequest
            {
                Name = "John",
                Email = "john@test.com",
                Password = "123456",
                ConfirmPassword = "123456"
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Register(request));

            Assert.Equal("Email already exists", exception.Message);
        }

        [Fact]
        public void Register_ValidRequest_CreatesUser()
        {
            _authRepositoryMock
                .Setup(x => x.EmailExists(It.IsAny<string>()))
                .Returns(false);

            var request = new RegisterRequest
            {
                Name = "John",
                Email = "john@test.com",
                Password = "123456",
                ConfirmPassword = "123456"
            };

            _authService.Register(request);

            _authRepositoryMock.Verify(x =>
                x.CreateUser(
                    request.Name,
                    request.Email,
                    It.IsAny<string>()
                ),
                Times.Once);
        }

        //=========================LOGIN TESTS
        [Fact]
        public void Login_EmptyEmail_ThrowsException()
        {
            var request = new LoginRequest
            {
                Email = "",
                Password = "123456"
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Login(request));

            Assert.Equal("Email is required", exception.Message);
        }

        [Fact]
        public void Login_EmptyPassword_ThrowsException()
        {
            var request = new LoginRequest
            {
                Email = "john@test.com",
                Password = ""
            };

            var exception = Assert.Throws<Exception>(() =>
                _authService.Login(request));

            Assert.Equal("Password is required", exception.Message);
        }

        [Fact]
        public void Login_UserNotFound_ReturnsFailure()
        {
            _authRepositoryMock
                .Setup(x => x.GetUserByEmail(It.IsAny<string>()))
                .Returns((LoginResult?)null);

            var request = new LoginRequest
            {
                Email = "john@test.com",
                Password = "123456"
            };

            var result = _authService.Login(request);

            Assert.False(result.Success);
            Assert.Equal("User not found", result.Message);
        }

        [Fact]
        public void Login_InvalidPassword_ReturnsFailure()
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("correctpassword");

            _authRepositoryMock
                .Setup(x => x.GetUserByEmail(It.IsAny<string>()))
                .Returns(new LoginResult
                {
                    ClientId = 1,
                    ClientName = "John",
                    HashedPassword = hashedPassword
                });

            var request = new LoginRequest
            {
                Email = "john@test.com",
                Password = "wrongpassword"
            };

            var result = _authService.Login(request);

            Assert.False(result.Success);
            Assert.Equal("Invalid email or password", result.Message);
        }

        [Fact]
        public void Login_ValidCredentials_ReturnsSuccess()
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456");

            _authRepositoryMock
                .Setup(x => x.GetUserByEmail(It.IsAny<string>()))
                .Returns(new LoginResult
                {
                    ClientId = 1,
                    ClientName = "John",
                    HashedPassword = hashedPassword
                });

            var request = new LoginRequest
            {
                Email = "john@test.com",
                Password = "123456"
            };

            var result = _authService.Login(request);

            Assert.True(result.Success);
            Assert.Equal("Login successful", result.Message);
            Assert.Equal(1, result.ClientId);
            Assert.Equal("John", result.ClientName);
            Assert.False(string.IsNullOrEmpty(result.Token));
        }
    }
}