FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "personalfinancetracker/personal-finance-trcker/target/personal-finance-tracker-0.0.1-SNAPSHOT.jar"]