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

# Install curl (healthcheck) and keytool needs to be available (included in JRE)
RUN apk add --no-cache curl && \
    addgroup -g 1001 -S spring && \
    adduser -u 1001 -S spring -G spring

# Copy the built jar
COPY --from=build /app/target/*.jar /app/app.jar

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Change ownership
RUN chown -R spring:spring /app

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run entrypoint as root so keytool can write to JVM cacerts, then drops to spring via exec
ENTRYPOINT ["/app/docker-entrypoint.sh"]
