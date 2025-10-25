import axios from "axios";
import type {CreateBusCompanyDto} from "../dto/BusCompany/create-bus-company.dto";

export const busCompanyAPI = {
    createFacility(createBusCompanyDto: CreateBusCompanyDto) {
    return axios
      .post("facility", createBusCompanyDto)
      .then((res) => res.data);
  },
}