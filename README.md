# Patient Management Microservices Project

## Overview
The **Patient Management Microservices** project is a distributed system designed to manage patient data, authentication, billing, and analytics for a healthcare application. It leverages a microservices architecture to ensure scalability, modularity, and maintainability. Each service is independently deployable, communicates through well-defined APIs, and uses modern technologies such as Spring Boot, Kafka, gRPC, and JWT for secure and efficient operations.

## Project Structure
The project is organized into multiple microservices, each responsible for a specific domain of functionality. Below is an overview of the key components:

```
patient-management/
├── api-gateway/                    # Secure entry point for client requests
│   ├── src/main/java/com/ccp/apigateway/
│   │   ├── filter/JwtValidationGatewayFilterFactory.java
│   │   ├── JwtValidationException.java
│   │   └── ApiGatewayApplication.java
│   ├── src/main/resources/application.yml
│   └── Dockerfile | pom.xml | HELP.md

├── auth-service/                   # User authentication & JWT management
│   ├── src/main/java/com/ccp/authservice/
│   │   ├── config/SecurityConfig.java
│   │   ├── controller/AuthController.java
│   │   ├── dto/LoginRequestDTO.java | LoginResponseDTO.java
│   │   ├── model/User.java | repository/UserRepository.java
│   │   ├── service/UserService.java | util/JwtUtil.java
│   │   └── AuthServiceApplication.java
│   ├── src/main/resources/application.properties | data.sql
│   └── Dockerfile | pom.xml | HELP.md

├── patient-service/                # Patient data CRUD, Kafka, gRPC
│   ├── src/main/java/com/ccp/patientservice/
│   │   ├── controller/PatientController.java
│   │   ├── dto/PatientRequestDTO.java | PatientResponseDTO.java
│   │   ├── exception/GlobalExceptionHandler.java | ...
│   │   ├── grpc/BillingServiceGrpcClient.java
│   │   ├── kafka/KafkaProducer.java
│   │   ├── mapper/PatientMapper.java
│   │   ├── model/Patient.java | repository/PatientRepository.java
│   │   └── service/PatientService.java
│   ├── src/main/proto/billing_service.proto | patient_event.proto
│   ├── src/main/resources/application.properties | data.sql
│   └── Dockerfile | pom.xml | HELP.md

├── analytics-service/              # Real-time patient analytics
│   ├── src/main/java/com/ccp/analyticsservice/
│   │   ├── kafka/KafkaConsumer.java
│   │   └── AnalyticsServiceApplication.java
│   ├── src/main/proto/patient_event.proto
│   ├── src/main/resources/application.properties
│   └── Dockerfile | pom.xml | HELP.md

├── billing-service/                # Billing operations via gRPC
│   ├── src/main/java/com/ccp/billingservice/
│   │   ├── grpc/BillingGrpcService.java
│   │   └── BillingServiceApplication.java
│   ├── src/main/proto/billing_service.proto
│   └── Dockerfile | pom.xml | HELP.md

├── api-requests/                   # Sample REST API requests
│   ├── auth-service/ (login.http, validate.http)
│   └── patient-service/ (create-patient.http, ...)

├── grpc-requests/                  # Sample gRPC requests
│   └── billing-service/ (create-billing-account.http)

├── pom.xml                         # Parent Maven configuration
├── Dockerfile                      # Parent Docker setup
└── HELP.md
```

### 1. API Gateway (`api-gateway/`)
- **Purpose**: Serves as the entry point for all client requests, handling routing, authentication, and request filtering.
- **Key Components**:
    - `JwtValidationGatewayFilterFactory.java`: Custom filter for validating JWT tokens.
    - `JwtValidationException.java`: Custom exception for JWT validation errors.
    - `ApiGatewayApplication.java`: Main Spring Boot application class.
    - `application.yml`: Configuration for routing and gateway settings.
- **Technologies**: Spring Cloud Gateway, Java, JWT.

### 2. Authentication Service (`auth-service/`)
- **Purpose**: Manages user authentication and JWT token generation/validation.
- **Key Components**:
    - `SecurityConfig.java`: Configures Spring Security for authentication.
    - `AuthController.java`: REST endpoints for login and token validation.
    - `LoginRequestDTO.java` & `LoginResponseDTO.java`: Data transfer objects for authentication requests/responses.
    - `User.java` & `UserRepository.java`: User model and data access layer.
    - `UserService.java` & `JwtUtil.java`: Business logic for user management and JWT handling.
    - `application.properties` & `data.sql`: Configuration and initial database setup.
- **Technologies**: Spring Boot, Spring Security, JWT, JPA, H2/PostgreSQL.

### 3. Patient Service (`patient-service/`)
- **Purpose**: Handles patient data management, including CRUD operations and integration with billing and analytics services.
- **Key Components**:
    - `PatientController.java`: REST endpoints for patient management.
    - `PatientRequestDTO.java` & `PatientResponseDTO.java`: DTOs for patient data.
    - `EmailAlreadyExistsException.java` & `PatientNotFoundException.java`: Custom exceptions for error handling.
    - `GlobalExceptionHandler.java`: Centralized exception handling.
    - `BillingServiceGrpcClient.java`: gRPC client for communicating with the billing service.
    - `KafkaProducer.java`: Publishes patient events to Kafka for analytics.
    - `PatientMapper.java`: Maps between entity and DTO objects.
    - `Patient.java` & `PatientRepository.java`: Patient model and data access layer.
    - `billing_service.proto` & `patient_event.proto`: Protocol buffer definitions for gRPC and Kafka.
- **Technologies**: Spring Boot, JPA, gRPC, Kafka, Protobuf.

### 4. Analytics Service (`analytics-service/`)
- **Purpose**: Consumes patient-related events from Kafka to generate analytics and insights.
- **Key Components**:
    - `KafkaConsumer.java`: Consumes patient events from Kafka topics.
    - `AnalyticsServiceApplication.java`: Main Spring Boot application class.
    - `patient_event.proto`: Protocol buffer definition for patient events.
- **Technologies**: Spring Boot, Kafka, Protobuf.

### 5. Billing Service (`billing-service/`)
- **Purpose**: Manages billing accounts and operations, exposed via gRPC.
- **Key Components**:
    - `BillingGrpcService.java`: gRPC service implementation for billing operations.
    - `BillingServiceApplication.java`: Main Spring Boot application class.
    - `billing_service.proto`: Protocol buffer definition for gRPC communication.
- **Technologies**: Spring Boot, gRPC, Protobuf.

### 6. API and gRPC Requests (`api-requests/` & `grpc-requests/`)
- **Purpose**: Provides sample HTTP and gRPC requests for testing the services.
- **Key Files**:
    - `auth-service/*.http`: HTTP requests for login and token validation.
    - `patient-service/*.http`: HTTP requests for patient CRUD operations.
    - `billing-service/create-billing-account.http`: gRPC request for creating billing accounts.

## Key Features
- **Scalability**: Each microservice can be independently scaled based on demand.
- **Security**: JWT-based authentication ensures secure access to APIs.
- **Event-Driven Architecture**: Kafka is used for asynchronous communication between services (e.g., patient events for analytics).
- **Inter-Service Communication**: gRPC enables efficient communication between the patient and billing services.
- **Centralized API Management**: The API Gateway routes and filters all incoming requests.
- **Data Persistence**: JPA with H2/PostgreSQL for data storage in auth and patient services.
- **Error Handling**: Custom exceptions and a global exception handler ensure robust error management.

## Technologies Used
- **Backend**: Java, Spring Boot, Spring Cloud Gateway, Spring Security, JPA, gRPC, Kafka.
- **Data**: H2/PostgreSQL (configurable), Protocol Buffers.
- **Build Tool**: Maven.
- **Containerization**: Docker (each service has its own `Dockerfile`).
- **Configuration**: YAML/Properties files for service configuration.
- **Version Control**: Git (with `.gitignore` and `.gitattributes` for each service).

## Getting Started
1. **Prerequisites**:
    - Java 17 or later.
    - Maven for dependency management.
    - Docker for containerization.
    - Kafka and PostgreSQL (or H2 for development).
2. **Setup**:
    - Clone the repository.
    - Navigate to each service directory and run `mvn clean install` to build.
    - Use `docker-compose` or individual `Dockerfile`s to deploy services.
3. **Running**:
    - Start the services in the following order: auth-service, billing-service, analytics-service, patient-service, api-gateway.
    - Use the `.http` files in `api-requests/` and `grpc-requests/` for testing.
4. **Configuration**:
    - Update `application.properties` or `application.yml` in each service for database, Kafka, and gRPC settings.


# Patient Service

---

## Environment Variables

```
JAVA_TOOL_OPTIONS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005;
SPRING_DATASOURCE_PASSWORD=manager;
SPRING_DATASOURCE_URL=jdbc:postgresql://patient-service-db:5432/db;
SPRING_DATASOURCE_USERNAME=admin_user;
SPRING_JPA_HIBERNATE_DDL_AUTO=update;
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092;
SPRING_SQL_INIT_MODE=always
```

# Billing Service

---

## gRPC Setup

Add the following to the `<dependencies>` section
```
<!--GRPC -->
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-netty-shaded</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-protobuf</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-stub</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency> <!-- necessary for Java 9+ -->
    <groupId>org.apache.tomcat</groupId>
    <artifactId>annotations-api</artifactId>
    <version>6.0.53</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-spring-boot-starter</artifactId>
    <version>3.1.0.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>4.29.1</version>
</dependency>

```

Replace the `<build>` section with the following

```

<build>
    <extensions>
        <!-- Ensure OS compatibility for protoc -->
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.0</version>
        </extension>
    </extensions>
    <plugins>
        <!-- Spring boot / maven  -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>

        <!-- PROTO -->
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>com.google.protobuf:protoc:3.25.5:exe:${os.detected.classifier}</protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.68.1:exe:${os.detected.classifier}</pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>

```

# Patient Service

---

## Environment Variables (complete list)
```bash
BILLING_SERVICE_ADDRESS=billing-service;
BILLING_SERVICE_GRPC_PORT=9005;
JAVA_TOOL_OPTIONS=-agentlib:jdwp\=transport\=dt_socket,server\=y,suspend\=n,address\=*:5005;
SPRING_DATASOURCE_PASSWORD=password;
SPRING_DATASOURCE_URL=jdbc:postgresql://patient-service-db:5432/db;
SPRING_DATASOURCE_USERNAME=admin_user;
SPRING_JPA_HIBERNATE_DDL_AUTO=update;
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092;
SPRING_SQL_INIT_MODE=always
```


## gRPC Setup

Add the following to the `<dependencies>` section
```
<!--GRPC -->
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-netty-shaded</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-protobuf</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-stub</artifactId>
    <version>1.69.0</version>
</dependency>
<dependency> <!-- necessary for Java 9+ -->
    <groupId>org.apache.tomcat</groupId>
    <artifactId>annotations-api</artifactId>
    <version>6.0.53</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-spring-boot-starter</artifactId>
    <version>3.1.0.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>4.29.1</version>
</dependency>

```

Replace the `<build>` section with the following

```

<build>
    <extensions>
        <!-- Ensure OS compatibility for protoc -->
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.0</version>
        </extension>
    </extensions>
    <plugins>
        <!-- Spring boot / maven  -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>

        <!-- PROTO -->
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>com.google.protobuf:protoc:3.25.5:exe:${os.detected.classifier}</protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.68.1:exe:${os.detected.classifier}</pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>

```

## Kafka Container

Copy/paste this line into the environment variables when running the container in intellij
```
KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,EXTERNAL://localhost:9094;KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER;KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093;KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT;KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094;KAFKA_CFG_NODE_ID=0;KAFKA_CFG_PROCESS_ROLES=controller,broker
```

## Kafka Producer Setup (Patient Service)

Add the following to `application.properties`
```
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.ByteArrayDeserializer
```


# Notification Service

---

## Environment Vars

```
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

## Protobuf/Kafka

Dependencies (add in addition to whats there)

```
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <version>3.3.0</version>
</dependency>

<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>4.29.1</version>
</dependency>
```

Update the build section in pom.xml with the following

```
    <build>
        <extensions>
            <!-- Ensure OS compatibility for protoc -->
            <extension>
                <groupId>kr.motd.maven</groupId>
                <artifactId>os-maven-plugin</artifactId>
                <version>1.7.0</version>
            </extension>
        </extensions>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <plugin>
                <groupId>org.xolstice.maven.plugins</groupId>
                <artifactId>protobuf-maven-plugin</artifactId>
                <version>0.6.1</version>
                <configuration>
                    <protocArtifact>com.google.protobuf:protoc:3.25.5:exe:${os.detected.classifier}</protocArtifact>
                    <pluginId>grpc-java</pluginId>
                    <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.68.1:exe:${os.detected.classifier}</pluginArtifact>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>compile-custom</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```


# Auth service

Dependencies (add in addition to whats there)

```
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.6</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.6</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.6</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.6.0</version>
        </dependency>
        <dependency>
          <groupId>com.h2database</groupId>
          <artifactId>h2</artifactId>
        </dependency>
       
```

## Environment Variables

```
SPRING_DATASOURCE_PASSWORD=manager
SPRING_DATASOURCE_URL=jdbc:postgresql://auth-service-db:5432/db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_SQL_INIT_MODE=always
```


## Data.sql

```sql
-- Ensure the 'users' table exists
CREATE TABLE IF NOT EXISTS "users" (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert the user if no existing user with the same id or email exists
INSERT INTO "users" (id, email, password, role)
SELECT '223e4567-e89b-12d3-a456-426614174006', 'testuser@test.com',
       '$2b$12$7hoRZfJrRKD2nIm2vHLs7OBETy.LWenXXMLKf99W8M4PUwO6KB7fu', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1
    FROM "users"
    WHERE id = '223e4567-e89b-12d3-a456-426614174006'
       OR email = 'testuser@test.com'
);



```


# Auth Service DB

## Environment Variables

```
POSTGRES_DB=db;POSTGRES_PASSWORD=password;POSTGRES_USER=admin_user
```


## Future Enhancements
- Implement monitoring and logging with tools like Prometheus and Grafana.
- Add more advanced analytics features in the analytics service.
- Introduce CI/CD pipelines for automated testing and deployment.
- Enhance security with OAuth2 or additional authentication mechanisms.

## Notes
- checkout the Visualization folder there is a overview.html helps to understand the project architecture better
- Each service includes a `HELP.md` file with detailed setup and usage instructions.
- The project uses a modular Maven structure with a parent `pom.xml` for shared dependencies.