plugins {
	java
	id("org.springframework.boot") version "3.5.5" apply false
	id("io.spring.dependency-management") version "1.1.7" apply false
}

allprojects {
	apply(plugin = "java")

	java {
		toolchain {
			languageVersion = JavaLanguageVersion.of(21)
		}
	}

	group = "com.CNTTK18"
	version = "0.0.1-SNAPSHOT"
	description = "Restaurant Website"

	repositories {
        mavenCentral()  
    }
}

subprojects {
	apply(plugin = "io.spring.dependency-management")

	configurations {
	    compileOnly {
		    extendsFrom(configurations.annotationProcessor.get())
	    }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}
