# Multi-stage build for Quarkus JVM mode
# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and POM first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built artifact
COPY --from=build /app/target/quarkus-app/ ./quarkus-app/

EXPOSE 8080

ENV JAVA_OPTS="-Xms128m -Xmx256m"

CMD ["java", "-jar", "quarkus-app/quarkus-run.jar"]
