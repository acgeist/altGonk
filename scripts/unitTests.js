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
        }), 99900);
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
QUnit.test("canFile(wxJson, useCirclAppch = false)", function (assert){
  assert.deepEqual(canFile({
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
  assert.deepEqual(canFile({
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
QUnit.test("altReqd(wxJson)", function (assert){
  assert.deepEqual(altReqd({
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
  assert.deepEqual(altReqd({
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
QUnit.test("isValidAlt(wxJson)", function (assert){
  assert.deepEqual(isValidAlt({
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
  assert.deepEqual(isValidAlt({
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
QUnit.test("getStoplightClassFromTaf(tafJson, isHomeStation = false)", function (assert){
  assert.deepEqual(getStoplightClassFromTaf({
            "fcst_time_from": "2017-03-01T05:00:00Z",
            "fcst_time_to": "2017-03-01T10:00:00Z",
            "change_indicator": "BECMG",
            "time_becoming": "2017-03-01T06:00:00Z",
            "wind_dir_degrees": "240",
            "wind_speed_kt": "20",
            "wind_gust_kt": "35",
            "visibility_statute_mi": "4.97",
            "altim_in_hg": "29.49803",
            "wx_string": "-SHRA",
            "sky_condition": {
              "@attributes": {
                "sky_cover": "BKN",
                "cloud_base_ft_agl": "1000"
              }
            },
            "turbulence_condition": {
              "@attributes": {
                "turbulence_intensity": "4",
                "turbulence_max_alt_ft_agl": "4000"
              }
            },
            "icing_condition": [
              {
                "@attributes": {
                  "icing_intensity": "1",
                  "icing_min_alt_ft_agl": "2000",
                  "icing_max_alt_ft_agl": "11000"
                }
              },
              {
                "@attributes": {
                  "icing_intensity": "1",
                  "icing_min_alt_ft_agl": "11000",
                  "icing_max_alt_ft_agl": "14000"
                }
              }
            ]
          }, true), "bg-warning");
});
QUnit.test("convertTextTime(textTime)", function (assert){
  assert.deepEqual(convertTextTime("2017-02-27T14:13:00Z"), new Date(Date.UTC(2017, 1, 27, 14, 13)));
  assert.deepEqual(convertTextTime("\"2017-02-27T14:13:00Z\""), new Date(Date.UTC(2017, 1, 27, 14, 13)));
});
QUnit.test("belowMinsForTempShwrs(forecast)", function (assert){
  assert.deepEqual(belowMinsForTempShwrs({
            "fcst_time_from": "2017-02-27T21:00:00Z",
            "fcst_time_to": "2017-02-28T01:00:00Z",
            "wind_dir_degrees": "220",
            "wind_speed_kt": "15",
            "wind_gust_kt": "20",
            "visibility_statute_mi": "4.97",
            "altim_in_hg": "29.29134",
            "wx_string": "-SHRA",
            "sky_condition": {
              "@attributes": {
                "sky_cover": "BKN",
                "cloud_base_ft_agl": "900"
              }
            },
            "turbulence_condition": {
              "@attributes": {
                "turbulence_intensity": "4",
                "turbulence_max_alt_ft_agl": "4000"
              }
            },
            "icing_condition": {
              "@attributes": {
                "icing_intensity": "1",
                "icing_min_alt_ft_agl": "8000",
                "icing_max_alt_ft_agl": "16000"
              }
            }
          }), false);
});
