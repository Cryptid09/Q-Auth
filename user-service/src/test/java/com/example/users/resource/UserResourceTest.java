package com.example.users.resource;

import com.example.users.dto.LoginRequest;
import com.example.users.dto.SignupRequest;
import com.example.users.dto.GoogleAuthRequest;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for UserResource REST endpoints.
 * Tests run against a live Quarkus instance with a real database.
 */
@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserResourceTest {

    private static final String TEST_EMAIL = "integration-test@oppex.dev";
    private static final String TEST_PASSWORD = "SecurePass123!";
    private static String userId;
    private static String verificationToken;

    @Test
    @Order(1)
    void registerNewUser_shouldReturn201() {
        SignupRequest request = new SignupRequest(TEST_EMAIL, TEST_PASSWORD);

        userId = given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users")
                .then()
                .statusCode(201)
                .header("Location", containsString("/users/"))
                .extract()
                .path("id");
    }

    @Test
    @Order(2)
    void registerDuplicateEmail_shouldReturn409() {
        SignupRequest request = new SignupRequest(TEST_EMAIL, TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users")
                .then()
                .statusCode(409)
                .body("error", containsString("already registered"));
    }

    @Test
    @Order(3)
    void registerWithInvalidEmail_shouldReturn400() {
        SignupRequest request = new SignupRequest("not-an-email", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users")
                .then()
                .statusCode(400);
    }

    @Test
    @Order(4)
    void registerWithShortPassword_shouldReturn400() {
        SignupRequest request = new SignupRequest("short@oppex.dev", "123");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users")
                .then()
                .statusCode(400);
    }

    @Test
    @Order(5)
    void loginSuccess_shouldReturn200() {
        LoginRequest request = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users/login")
                .then()
                .statusCode(200)
                .body("email", equalTo(TEST_EMAIL))
                .body("verified", equalTo(false))
                .body("id", notNullValue());
    }

    @Test
    @Order(6)
    void loginWrongPassword_shouldReturn401() {
        LoginRequest request = new LoginRequest(TEST_EMAIL, "WrongPassword!");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users/login")
                .then()
                .statusCode(401)
                .body("error", containsString("Invalid"));
    }

    @Test
    @Order(7)
    void loginNonExistentUser_shouldReturn401() {
        LoginRequest request = new LoginRequest("nobody@oppex.dev", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users/login")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(8)
    void getUserById_shouldReturn200() {
        given()
                .when()
                .get("/users/" + userId)
                .then()
                .statusCode(200)
                .body("email", equalTo(TEST_EMAIL))
                .body("id", equalTo(userId));
    }

    @Test
    @Order(9)
    void verifyWithInvalidToken_shouldReturn400() {
        given()
                .queryParam("token", "invalid-token-12345")
                .when()
                .get("/users/verify")
                .then()
                .statusCode(400)
                .body("error", containsString("Invalid"));
    }

    @Test
    @Order(10)
    void getNonExistentUser_shouldReturn404() {
        given()
                .when()
                .get("/users/00000000-0000-0000-0000-000000000000")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(11)
    void googleLogin_shouldReturn200() {
        // {"email":"google@oppex.dev","sub":"google123"} base64url encoded
        String token = "header.eyJlbWFpbCI6Imdvb2dsZUBvcHBleC5kZXYiLCJzdWIiOiJnb29nbGUxMjMifQ.signature";
        GoogleAuthRequest request = new GoogleAuthRequest(token);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/users/google")
                .then()
                .statusCode(200)
                .body("email", equalTo("google@oppex.dev"))
                .body("verified", equalTo(true));
    }
}
