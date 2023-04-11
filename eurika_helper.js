import axios from "axios";
import Resilient from "resilient";

const eurekaService = `http://registry:8080/eureka`;

export default {
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
