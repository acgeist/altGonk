"use strict";
QUnit.test("hasCeil(skyCondNode)", function (assert) {
  assert.deepEqual(hasCeil({"@attributes": {"sky_cover": "OVX","cloud_base_ft_agl": "0"}}), true);
  assert.deepEqual(hasCeil([
          {
            "@attributes": {
              "sky_cover": "BKN",
              "cloud_base_ft_agl": "700"
            }
          },
          {
            "@attributes": {
              "sky_cover": "BKN",
              "cloud_base_ft_agl": "2000"
            }
          },
          {
            "@attributes": {
              "sky_cover": "OVC",
              "cloud_base_ft_agl": "4200"
            }
          }
        ]), true);
  assert.deepEqual(hasCeil({    
          "@attributes": {
            "sky_cover": "CLR"
          }}), false);        
  assert.deepEqual(hasCeil([
          {
            "@attributes": {
              "sky_cover": "FEW",
              "cloud_base_ft_agl": "700"
            }
          },
          {
            "@attributes": {
              "sky_cover": "BKN",
              "cloud_base_ft_agl": "1900"
            }
          }
        ]), true);
});
QUnit.test("getCeilFromSkyCond(skyCondNode)", function (assert){
  assert.deepEqual(getCeilFromSkyCond({
          "@attributes": {
            "sky_cover": "CLR"
          }
        }), 99999);
  assert.deepEqual(getCeilFromSkyCond([
          {
            "@attributes": {
              "sky_cover": "FEW",
              "cloud_base_ft_agl": "700"
            }
          },
          {
            "@attributes": {
              "sky_cover": "BKN",
              "cloud_base_ft_agl": "1900"
            }
          }
        ]), 1900);
});
QUnit.test("canFileMetar(metarJson, useCirclAppch = false)", function (assert){
  assert.deepEqual(canFileMetar({
        "raw_text": "KVAD 270306Z AUTO 00000KT 4SM R36/4500FT HZ CLR 08/00 A3023 RMK AO2 SLP240",
        "station_id": "KVAD",
        "observation_time": "2017-02-27T03:06:00Z",
        "latitude": "30.97",
        "longitude": "-83.2",
        "temp_c": "8.0",
        "dewpoint_c": "0.0",
        "wind_dir_degrees": "0",
        "wind_speed_kt": "0",
        "visibility_statute_mi": "4.0",
        "altim_in_hg": "30.230314",
        "sea_level_pressure_mb": "1024.0",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE"
        },
        "wx_string": "HZ",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "CLR"
          }
        },
        "flight_category": "MVFR",
        "metar_type": "SPECI",
        "elevation_m": "71.0"
      }), true);
  assert.deepEqual(canFileMetar({
        "raw_text": "KBLU 270314Z AUTO 18017G25KT 3/4SM BR OVC002 M02/M02 A2975 RMK AO2 T10221022 TSNO",
        "station_id": "KBLU",
        "observation_time": "2017-02-27T03:14:00Z",
        "latitude": "39.28",
        "longitude": "-120.7",
        "temp_c": "-2.2",
        "dewpoint_c": "-2.2",
        "wind_dir_degrees": "180",
        "wind_speed_kt": "17",
        "wind_gust_kt": "25",
        "visibility_statute_mi": "0.75",
        "altim_in_hg": "29.749016",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE",
          "lightning_sensor_off": "TRUE"
        },
        "wx_string": "BR",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "OVC",
            "cloud_base_ft_agl": "200"
          }
        },
        "flight_category": "LIFR",
        "metar_type": "SPECI",
        "elevation_m": "1609.0"
      }), false);
});
QUnit.test("altReqdMetar(metarJson)", function (assert){
  assert.deepEqual(altReqdMetar({
        "raw_text": "KBLU 270314Z AUTO 18017G25KT 3/4SM BR OVC002 M02/M02 A2975 RMK AO2 T10221022 TSNO",
        "station_id": "KBLU",
        "observation_time": "2017-02-27T03:14:00Z",
        "latitude": "39.28",
        "longitude": "-120.7",
        "temp_c": "-2.2",
        "dewpoint_c": "-2.2",
        "wind_dir_degrees": "180",
        "wind_speed_kt": "17",
        "wind_gust_kt": "25",
        "visibility_statute_mi": "0.75",
        "altim_in_hg": "29.749016",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE",
          "lightning_sensor_off": "TRUE"
        },
        "wx_string": "BR",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "OVC",
            "cloud_base_ft_agl": "200"
          }
        },
        "flight_category": "LIFR",
        "metar_type": "SPECI",
        "elevation_m": "1609.0"
      }), true);
  assert.deepEqual(altReqdMetar({
        "raw_text": "KVAD 270314Z AUTO 11005KT 4SM HZ CLR 09/01 A3023 RMK AO2 SLP240 $",
        "station_id": "KVAD",
        "observation_time": "2017-02-27T03:14:00Z",
        "latitude": "30.97",
        "longitude": "-83.2",
        "temp_c": "9.0",
        "dewpoint_c": "1.0",
        "wind_dir_degrees": "110",
        "wind_speed_kt": "5",
        "visibility_statute_mi": "4.0",
        "altim_in_hg": "30.230314",
        "sea_level_pressure_mb": "1024.0",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE",
          "maintenance_indicator_on": "TRUE"
        },
        "wx_string": "HZ",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "CLR"
          }
        },
        "flight_category": "MVFR",
        "metar_type": "SPECI",
        "elevation_m": "71.0"
      }), false);
});
QUnit.test("isValidAltMetar(metarJson)", function (assert){
  assert.deepEqual(isValidAltMetar({
        "raw_text": "KVAD 270306Z AUTO 00000KT 4SM R36/4500FT HZ CLR 08/00 A3023 RMK AO2 SLP240",
        "station_id": "KVAD",
        "observation_time": "2017-02-27T03:06:00Z",
        "latitude": "30.97",
        "longitude": "-83.2",
        "temp_c": "8.0",
        "dewpoint_c": "0.0",
        "wind_dir_degrees": "0",
        "wind_speed_kt": "0",
        "visibility_statute_mi": "4.0",
        "altim_in_hg": "30.230314",
        "sea_level_pressure_mb": "1024.0",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE"
        },
        "wx_string": "HZ",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "CLR"
          }
        },
        "flight_category": "MVFR",
        "metar_type": "SPECI",
        "elevation_m": "71.0"
      }), true);
  assert.deepEqual(isValidAltMetar({
        "raw_text": "KBLU 270314Z AUTO 18017G25KT 3/4SM BR OVC002 M02/M02 A2975 RMK AO2 T10221022 TSNO",
        "station_id": "KBLU",
        "observation_time": "2017-02-27T03:14:00Z",
        "latitude": "39.28",
        "longitude": "-120.7",
        "temp_c": "-2.2",
        "dewpoint_c": "-2.2",
        "wind_dir_degrees": "180",
        "wind_speed_kt": "17",
        "wind_gust_kt": "25",
        "visibility_statute_mi": "0.75",
        "altim_in_hg": "29.749016",
        "quality_control_flags": {
          "auto": "TRUE",
          "auto_station": "TRUE",
          "lightning_sensor_off": "TRUE"
        },
        "wx_string": "BR",
        "sky_condition": {
          "@attributes": {
            "sky_cover": "OVC",
            "cloud_base_ft_agl": "200"
          }
        },
        "flight_category": "LIFR",
        "metar_type": "SPECI",
        "elevation_m": "1609.0"
      }), false);
});
QUnit.test("getStoplightClassFromMetar(metarJson, isHomeStation = false)", function (assert){
  //assert.deepEqual(getStoplightClassFromMetar(), "bg-success");
  assert.deepEqual(getStoplightClassFromMetar({
        "raw_text": "KGEG 270353Z 00000KT 2SM -SN BR FEW001 SCT006 OVC015 M02/M02 A2964 RMK AO2 SFC VIS 3 SLP059 P0000 T10171022 $",
        "station_id": "KGEG",
        "observation_time": "2017-02-27T03:53:00Z",
        "latitude": "47.62",
        "longitude": "-117.53",
        "temp_c": "-1.7",
        "dewpoint_c": "-2.2",
        "wind_dir_degrees": "0",
        "wind_speed_kt": "0",
        "visibility_statute_mi": "2.0",
        "altim_in_hg": "29.639763",
        "sea_level_pressure_mb": "1005.9",
        "quality_control_flags": {
          "auto_station": "TRUE",
          "maintenance_indicator_on": "TRUE"
        },
        "wx_string": "-SN BR",
        "sky_condition": [
          {
            "@attributes": {
              "sky_cover": "FEW",
              "cloud_base_ft_agl": "100"
            }
          },
          {
            "@attributes": {
              "sky_cover": "SCT",
              "cloud_base_ft_agl": "600"
            }
          },
          {
            "@attributes": {
              "sky_cover": "OVC",
              "cloud_base_ft_agl": "1500"
            }
          }
        ],
        "flight_category": "IFR",
        "precip_in": "0.005",
        "metar_type": "METAR",
        "elevation_m": "735.0"
      }), "bg-success");
  });
QUnit.test("convertTextTime(textTime)", function (assert){
  assert.deepEqual(convertTextTime("2017-02-27T14:13:00Z"), new Date(Date.UTC(2017, 1, 27, 14, 13)));
  assert.deepEqual(convertTextTime("\"2017-02-27T14:13:00Z\""), new Date(Date.UTC(2017, 1, 27, 14, 13)));
});