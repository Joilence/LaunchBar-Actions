# 
#	Bluetooth Audio Action for LaunchBar 6
# 	Dominique Da Silva https://github.com/atika
# 	January 2015
#   v1.1
#	

import objc
import Foundation
import AppKit

import sys
import os
import json
import time
import re

from IOBluetooth import *

menu = []
cmdkey = os.environ.get('LB_OPTION_ALTERNATE_KEY')

switchaudiotest=os.system('test -x /usr/local/bin/SwitchAudioSource')
if switchaudiotest != 0:
	menu.append({"title":"SwitchAudio not found", "subtitle":"Please install SwitchAudio : brew install switchaudio-osx", "icon": "BottomBarStopTemplate.pdf"})	

def notify(title, text):
    os.system("""
              osascript -e 'tell application "LaunchBar" to display notification "{}" with title "{}"'
              """.format(text, title))

if len(sys.argv) > 1:
	# Activate Bluetooth Device
	myitem = json.loads( str(sys.argv[1]) )
	deviceAddress = myitem['address']
	if re.match("[0-9a-f]{2}([-:])[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$", deviceAddress.lower()):
		device = IOBluetoothDevice.deviceWithAddressString_( deviceAddress )

		# Disconnect device
		if device.isConnected() and cmdkey == "1":
			notify("LaunchBar", myitem['name']+' Bluetooth device disconnected')
			device.closeConnection()
		else:
			# Connect device and set system audio output
			device.openConnection()
			time.sleep(1)
			result = os.system('/usr/local/bin/SwitchAudioSource -s "%s" >/dev/null' % (myitem['name']) )
			if result != 0:
				notify("LaunchBar Error", "Error when switching audio output to "+myitem['name'])
			else:
				notify("LaunchBar", myitem['name']+" connected, and audio output has been switched.")
	else:
		print("Not a valid mac address")
		notify("LaunchBar Error", "Not a valid mac address")
		
# List Bluetooth Audio Device
devices = IOBluetoothDevice.pairedDevices()

for d in devices:
	connected = d.isConnected()
	majorClass = d.deviceClassMajor()
	deviceName = d.getNameOrAddress()
	deviceTitle = deviceName + ' (connected)' if connected else deviceName
	device = {}

	if majorClass == 4:
		device['title'] = deviceTitle
		device['name'] = deviceName
		device['address'] = d.addressString()
		device['action'] = 'BluetoothAudio.py'
		device['icon'] = 'AudioStreamTemplate.pdf'
		device['actionRunsInBackground'] = False
		menu.append( device )

# Fallback, no audio device
if len(menu) == 0:
	menu.append({
		"title": "No Bluetooth audio device found",
		"icon": "BottomBarStopTemplate.pdf"
	})

print(json.dumps(menu))
