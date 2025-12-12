import com.diffplug.gradle.spotless.SpotlessExtension
plugins {
	java
	id("org.springframework.boot") version "3.5.5" apply false
	id("io.spring.dependency-management") version "1.1.7" apply false
	id("com.diffplug.spotless") version "6.25.0" apply false
}

allprojects {
	apply(plugin = "java")
	apply(plugin = "com.diffplug.spotless")
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
	if (name != "Common") {
		apply(plugin = "io.spring.dependency-management")
	}
	//apply(plugin = "com.diffplug.spotless")

	configure<SpotlessExtension> {
		java {
			googleJavaFormat().aosp()
			target("src/**/*.java")
			removeUnusedImports()
			importOrder()
		}
	}

	configurations {
	    compileOnly {
		    extendsFrom(configurations.annotationProcessor.get())
	    }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}
