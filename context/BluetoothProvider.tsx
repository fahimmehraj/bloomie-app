import React, { Dispatch, PropsWithChildren, createContext, useEffect, useReducer, useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { atob, btoa } from 'react-native-quick-base64';

export const BluetoothValuesContext = createContext<number[] | null>(null);
export const BluetoothDispatchContext = createContext<Dispatch<any> | null>(null);
export const BluetoothStatusContext = createContext<ConnectionState>("LOADING");

const CALIBRATION_SERVICE_UUID = "510c73b0-300e-11ee-aea4-0800200c9a66";
const CALIBRATION_SERVICE_COUNTER_CHARACTERISTIC_UUID = "4eb63c1d-4492-4f0e-9ffb-060be0d8e21c";
const WATER_LEVEL_SERVICE_UUID = "5e6d0579-6c16-4acd-a8e3-087797ba300b";
const WATER_LEVEL_VAL_UUID = "64e14ad8-c35b-4a40-98a2-a4ee5da845f5";
const LIGHT_LEVEL_SERVICE_UUID = "7efab126-fbf3-49b4-85ab-cef7acb0b0ef";
const LIGHT_LEVEL_VAL_UUID = "a4d4f96b-cadd-4d61-81eb-ec45cdd652f2";
const HEAT_LEVEL_SERVICE_UUID = "b88bf1fa-47a4-4133-8cca-2a2f7be9ae5f";
const HEAT_LEVEL_VAL_UUID = "4882f2b7-19db-4ce6-897d-e320187550f2";


const bleManager = new BleManager();

type ConnectionState = "SCANNING" | "LOADING" | "ERROR" | "CONNECTED";

export const BluetoothProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const searchAndConnectToDevice = async () => {
        if ((await bleManager.state()) != "PoweredOn") {
            console.log("bluetooth not ready yet");
            const subscription = bleManager.onStateChange((state) => {
                if (state === "PoweredOn") {
                    searchAndConnectToDevice();
                    subscription.remove()
                }
            })
        }
        bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error || device == null) {
                console.error(error);
                setConnectionStatus("ERROR");
                return;
            }
            console.log(device.name ?? "no name");
            if (device.name === "Bloomie") {
                bleManager.stopDeviceScan();
                setConnectionStatus("LOADING");
                await connectToDevice(device);
            }
        });
    };
    const connectToDevice = (device: Device) => {
        return device
            .connect()
            .then((device) => {
                deviceRef.current = device;
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                deviceRef.current = device;
                return device.services();
            })
            .then((services) => {
                console.log(services.map((service) => service.uuid))
                let service = services.find((service) => service.uuid === CALIBRATION_SERVICE_UUID);
                if (!service) {
                    throw "Device has name of Bloomie but has no calibration service!";
                }
                return service.characteristics();
            })
            .then((characteristics) => {
                let stepDataCharacteristic = characteristics.find(
                    (char) => char.uuid === CALIBRATION_SERVICE_COUNTER_CHARACTERISTIC_UUID
                );
                if (!stepDataCharacteristic) {
                    throw "Device has calibration service but no counter!"
                }
                return stepDataCharacteristic.read();
            })
            .then((characteristic) => {
                console.log("Current value:", atob(characteristic.value!));
                return characteristic.writeWithResponse(btoa("1"));
            })
            .then((characteristic) => {
                return characteristic.read();
            }).then((characteristic) => {
                console.log("New value:", atob(characteristic.value!));
                setConnectionStatus("CONNECTED");
                console.log("post values", values)
            })
            .catch((error) => {
                console.log(error);
                setConnectionStatus("ERROR");
            });
    }
    const bluetoothReducer = (values: number[], action: any) => {
        switch (action.type) {
          case 'startCalibration': {
            searchAndConnectToDevice();
            return [1, ...values.slice(1)];
          }
          case 'proceedCalibration': {
            return [values[0] + 1, ...values.slice(1)];
          }
          case 'finishedCalibration': {
            return values;
          }
          case 'updateSensorValues': {
            console.log("update sensor called", action);
            if (action.sensor === "WATER") {
              console.log("should've updated");
              console.log([values[0], action.value, ...values.slice(2)])
              return [values[0], action.value, ...values.slice(2)];
            }
            if (action.sensor === "LIGHT") {
            console.log([values[0], values[1], action.value, values[3]])
              return [values[0], values[1], action.value, values[3]];
            }
            if (action.sensor === "HEAT") {
              console.log([...values.slice(0, 3), action.value])
              return [...values.slice(0, 3), action.value];
            }
            console.log("WHAAAAAAAAAAAATTTTTTTTT??");
            return values;
          }
          default: {
            return values;
          }
        }
      };

    const asyncDispatch = async (action: string) => {
        switch (action) {
            case 'startCalibration': {
                dispatch({ type: "startCalibration" });
                break;
            }
            case 'proceedCalibration': {
                const devices = await bleManager.connectedDevices([CALIBRATION_SERVICE_UUID]);
                if (!devices) {
                    throw "no devices connected???";
                }
                const bloomie = devices.find((device) => device.name == "Bloomie");
                if (!bloomie) {
                    console.log("no bloomie", devices);
                    throw "No bloomie";
                }
                let characteristic = await (await bloomie.writeCharacteristicWithResponseForService(CALIBRATION_SERVICE_UUID, CALIBRATION_SERVICE_COUNTER_CHARACTERISTIC_UUID, btoa(String(values[0] + 1)))).read();
                console.log("New calibration value: ", atob(characteristic.value!));
                dispatch({ type: "proceedCalibration" })
                break;
            }
            case 'finishedCalibration': {
                console.log('yahhhh')
                dispatch({ type: "finishedCalibration" });
                // start monitoring sensor data
                const services = await deviceRef.current?.services()
                services?.forEach(async (service) => {
                    if (service.uuid == WATER_LEVEL_SERVICE_UUID) {
                        const characteristic = await service.characteristics().then((characteristics) => characteristics.find((c) => c.uuid == WATER_LEVEL_VAL_UUID));
                        if (!characteristic) {
                            console.log("something went wrong with finding water level characteristic");
                            return;
                        }
                        characteristic.monitor((error, char) => {
                            if (error || char == null) {
                                console.error(error);
                                return;
                            }
                            const raw = atob(char.value!);
                            console.log(raw);
                            dispatch({ type: "updateSensorValues", sensor: "WATER", value: raw });
                            console.log(values);

                        })
                    } else if (service.uuid == LIGHT_LEVEL_SERVICE_UUID) {
                        const characteristic = await service.characteristics().then((characteristics) => characteristics.find((c) => c.uuid == LIGHT_LEVEL_VAL_UUID));
                        if (!characteristic) {
                            console.log("something went wrong with finding light level characteristic");
                            return;
                        }
                        characteristic.monitor((error, char) => {
                            if (error || char == null) {
                                console.error(error);
                                return;
                            }
                            const raw = atob(char.value!);
                            console.log(raw);
                            dispatch({ type: "updateSensorValues", sensor: "LIGHT", value: raw });
                            console.log(values);

                        })

                    } else if (service.uuid == HEAT_LEVEL_SERVICE_UUID) {
                        const characteristic = await service.characteristics().then((characteristics) => characteristics.find((c) => c.uuid == HEAT_LEVEL_VAL_UUID));
                        if (!characteristic) {
                            console.log("something went wrong with finding heat level characteristic");
                            return;
                        }
                        characteristic.monitor((error, char) => {
                            if (error || char == null) {
                                console.error(error);
                                return;
                            }
                            const raw = atob(char.value!);
                            console.log(raw);
                            dispatch({ type: "updateSensorValues", sensor: "HEAT", value: raw });
                            console.log(values);

                        })
                    } else {
                        console.log("Unknown service", service.uuid);
                    }
                })
            }
            case 'updateSensorValues': {
                dispatch({ type: "updateSensorValues" })
                break;
            }
            default: {
                console.log("what");
                break;
            }
        }
    }

    const [values, dispatch] = useReducer(
        bluetoothReducer,
        [0, 0, 0, 0]
    );
    const deviceRef = useRef<Device | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("SCANNING");

    useEffect(() => {
        if (!deviceRef.current) {
            return;
        }
        const subscription = bleManager.onDeviceDisconnected(
          deviceRef.current.id,
          (error, device) => {
            console.log("reconnecting,..")
            if (error || device == null) {
              console.log("Disconnected with error:", error);
              return;
            }
            setConnectionStatus("SCANNING");
            console.log("Disconnected device");
            if (deviceRef.current) {
              setConnectionStatus("LOADING");
              connectToDevice(device)
                .then(() => setConnectionStatus("CONNECTED"))
                .catch((error) => {
                  console.log("Reconnection failed: ", error);
                  setConnectionStatus("ERROR");
                });
            }
          }
        );
      }, [deviceRef.current]);




    return (
        <BluetoothValuesContext.Provider value={values}>
            <BluetoothDispatchContext.Provider value={asyncDispatch}>
                <BluetoothStatusContext.Provider value={connectionStatus}>
                    {children}
                </BluetoothStatusContext.Provider>
            </BluetoothDispatchContext.Provider>
        </BluetoothValuesContext.Provider>
    );
}
