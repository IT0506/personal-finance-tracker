# ---------- Build Stage ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy all project files
COPY . .

# Build the Spring Boot JAR
RUN mvn clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy generated JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT automatically; Spring Boot will use it.
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
