# syntax=docker/dockerfile:1

# Build stage
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw* ./
COPY pom.xml .
COPY .mvn .mvn

# Make mvnw executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for healthcheck and create app user
RUN apk add --no-cache curl && \
    addgroup -g 1001 -S spring && \
    adduser -u 1001 -S spring -G spring

# Copy the built jar
COPY --from=build /app/target/*.jar /app/app.jar

# Change ownership
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/customers || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
