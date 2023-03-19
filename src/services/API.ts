import axios from "axios";
import { API_URL } from "./Config";
import { AdCampaignType, AdCampaignOptimisation_Target } from "./DataProvider";

/****************************************/
/******* Ad Campaign          ***********/
/****************************************/

export interface CreateAdCampaignProps {
  ad_date: string;
  source: string;
  attributed_conversions: number;
  attributed_revenue: number;
  type: AdCampaignType;
  spends: number;
  partition_id: string;
  optimisation_target: AdCampaignOptimisation_Target;
}

export const createAdCampaign = async (props: CreateAdCampaignProps) => {
  const res = await axios.post(API_URL + "/create-adcampaign", { ...props });
  return res;
};

export const getAdCampaignLists = async () => {
  const res = await axios.get(API_URL + "/ad-capmaign-lists");
  return res;
};

export const deleteAdCampaign = async (id: string) => {
  const res = await axios.delete(API_URL + "/delete-add-campaign/" + id);
  return res;
};

/****************************************/
/******* To upload excel file   *********/
/****************************************/

export const uploadExcelFileAdCampaign = async (file: FormData) => {
  const res = await axios.post(API_URL + "/excel-file-upload", file);
  return res;
};

export const getExcelSheetUploadedData = async (limit: number) => {
  const res = await axios.get(
    API_URL + `/get-excel-uploaded-add-data?limit=${limit}`
  );
  return res;
};

// to get excel data to show in the chart

export const getExcelDatatoShowinChart = async () => {
  const res = await axios.get(API_URL + "/grouped-ad-data");
  return res;
};

export const deleteAllExcelData = async () => {
  const res = await axios.delete(API_URL + "/delete-all-excel-data");
  return res;
};

export const deleteSingleExcelSheetData = async (id: string) => {
  const res = await axios.delete(
    API_URL + "/delete-excelsheet-single-data/" + id
  );
  return res;
};

export const getExcelDataBySearchFilter = async (
  type: string,
  optimigation: string
) => {
  const res = await axios.get(
    API_URL +
      `/search-data?searchType=${type}&optimisationTarget=${optimigation}`
  );
  return res;
};
