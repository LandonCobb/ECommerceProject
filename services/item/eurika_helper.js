import axios from "axios";
import ip from "ip";
import Resilient from "resilient";

const eurekaService = `http://registry:8080/eureka`;

/**
 * Makes a random string of size @param length
 * @param {Number} length desired string length
 *
 * @return {String} random string of size `length`
 */
const makeId = (length) => {
  var result = "";
  var characters = "ABCDEFGHJKMNOPQRSTUVWRXYZ0123456789"; // No 'I' or 'L' to limit confusion (fonts tend to make thes look similar)
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const id = makeId(5);

export default {
  /**
   * Registers the service with Eureka
   * @param {String} appName name of service
   * @param {Number} port port app is runnong on
   */
  registerWithEureka: (appName, port) => {
    axios
      .post(
        `${eurekaService}/apps/${appName}`,
        JSON.stringify({
          instance: {
            hostName: `localhost`,
            instanceId: `${id}`,
            vipAddress: `${appName}`,
            app: `${appName.toUpperCase()}`,
            ipAddr: ip.address(),
            status: `UP`,
            port: {
              $: port,
              "@enabled": true,
            },
            dataCenterInfo: {
              "@class": `com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo`,
              name: `MyOwn`,
            },
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        console.log(`[${process.pid}] Registered with Eureka.`);
        setInterval(() => {
          axios
            .put(
              `${eurekaService}/apps/${appName}/${id}`,
              {},
              { headers: { "Content-Type": "application/json" } }
            )
            .then(() =>
              console.log(
                `[${process.pid}] Successfully sent heartbeat to Eureka.`
              )
            )
            .catch(() =>
              console.log(
                `[${process.pid}] Sending heartbeat to Eureka failed.`
              )
            );
        }, 50 * 1000);
      })
      .catch((error) =>
        console.log(
          ` [${process.pid}] Not registered with eureka due to: ${error}`
        )
      );
  },
  /**
   * Get all the registered services from Eureka
   * @returns {Array} all the services info
   */
  getAllApps: async () => {
    const apps = await (await axios.get(`${eurekaService}/apps`)).data;
    return apps.applications.application;
  },
  /**
   * @async
   * Get the service client by name
   * @param {String} name service name
   * @returns {Resilient} client
   */
  getClientByName: async (name) => {
    const apps = await (await axios.get(`${eurekaService}/apps`)).data;
    const instances = apps.applications.application.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );
    if (instances) {
      const client = Resilient();
      const servers = instances.instance.map((x) => `http://${x.ipAddr}:1000`);
      client.setServers(servers);
      return client;
    }
    return null;
  },
};
