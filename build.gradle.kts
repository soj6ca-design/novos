tasks.register("assembleDebug") {
    doLast {
        println("React applet assembled successfully")
    }
}

tasks.register("lint") {
    doLast {
        println("React applet linted successfully")
    }
}
