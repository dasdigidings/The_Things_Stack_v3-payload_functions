Der Payload-Decoder für TTI v.3 Stack ist hier nun verfügbar. Die senseBox:home in voller Ausbaustufe mit LoRa-Bee kann hiermit in der Konsole wieder lesbar gemacht werden. Bereitgestellt wird der Code von dasdigidings e.V. Caspar Armster / Jens Nowak.
 

     - senseBox-MCU oder senseBox-MCU light
     - LoRa-Bee 
     - Temperatur- und Luftfeuchtesensor (HDC1080)
     - Temperatur- Luftfeuchte und Drucksensor (BMP280)
     - UV- und Lichtstärkesensor (TSL45315 VEML6070)
     - Feinstaubsensor (SDS011)

Unser Decoder liegt im JSON-Format (JavaScript) vor - um diesen im thethingsstack CE zu verwenden wird der Text der Datei [decodeUplink.js](https://github.com/dasdigidings/The_Things_Stack_v3-payload_functions/blob/main/senseboxhome/decodeUplink.js "decodeUplink.js") als RAW Format angezeigt (Datei anklicken und rechts auf "RAW" umstellen. Anschließend wird der gesammte Inhalt der Datei mit STRG + C in die Zwischenabage kopiert.

Man wechselt in die Console von thethingsstack CE und öffnet dort die entsprechende Application und innerhalb der Applikation das Gerät (End devices), welches mit dem Payload-Decoder versehen werden soll. Mit einem Klick auf die Device-ID öffnet sich das Gerät - hier wechselt man links im Menü dann auf "Payload formatters" - "Uplink" - nun erscheint der bereits hinterlegte Standard-Decoder. Im "Formatter type" wird JSON / JavaScript ausgewählt -- und dort der Inhalt im Decoder Fenster markiert, dann mit STRG + V überschrieben. Unser Payload-Decoder sollte nun im Fenster auftgetaucht sein.

Nun muß noch die Anpassung an die Opensensemap erfolgen - die Sensor-IDs müssen zu den Variablen hinterlegt werden.  In einem weiteren Internetexplorer wird die Seite von opensensemap.de geöffnet, im eigenen Dashboard die LoRa-Sensebox:home ausgewählt und die Funktion "Editieren" ausgewählt. Nun wird links im Menü auf "Sensoren" geklickt - nun werden die vorher eingerichteten Sensoren angezeigt, auch Ihre jeweilige "Sensor-ID" ist zu sehen. Nacheinander werden die ID`s nun kopiert, und im noch geöffneten Payload-Decoder im thethingsstack CE eingefügt. Hier ist unbedingt auf die richtige Zuordnung der Sensoren zu achten, da sonst die falschen Werte decodiert werden. Wenn hier alle Zuordnungen kopiert wurden können mit "save changes" die Änderungen abgespeichert werden.

Nach wenigen Minuten sollten nun die decodierten Sensor-Meßwerte in der Konsole angezeigt werden. Der Payload-Decoder funktioniert, herzlichen Glückwunsch.


*This decoder is licensed by the AGPL-3.0 License, please have a look at the LICENSE file.*

