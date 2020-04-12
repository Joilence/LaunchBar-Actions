// LaunchBar Action Script

function runWithString(argument) {
	LaunchBar.openURL('bear://x-callback-url/search?term=' + argument)
}