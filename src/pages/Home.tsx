import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import PageLayout from "../layouts/PageLayout";
import CardLayout from "../components/CardLayout/CardLayout";
import ModalBox from "../components/Modal/ModalBox";
import style from "./Home.module.scss";
import {
  CreateAdCampaignProps,
  createAdCampaign,
  getAdCampaignLists,
} from "../services/API";
import {
  AdCampaignType,
  AdCampaignOptimisation_Target,
  ChartTypes,
  AdCampaignProps,
} from "../services/DataProvider";
import Charts from "../components/Charts/Charts";
import AdListsCard from "./AdListsCard";

const Home = () => {
  /****************************************/
  /******  Create Ad Campaign     *********/
  /****************************************/

  const [adPublishDate, setAdPublishDate] = useState<string>("");
  const [adSource, setAdSource] = useState<string>("");
  const [attributeConversions, setAttributedConversions] = useState<string>("");
  const [attributedRevenue, setAttributedRevenue] = useState<string>("");
  const [adCampaignType, setAdCampaignType] = useState<AdCampaignType>(
    AdCampaignType.baseline
  );
  const [adCampaignspends, setAdCampaignspends] = useState<string>("");
  const [partitionId, setPartitionId] = useState<string>("");
  const [optimisationTarget, setOptimisationTarget] =
    useState<AdCampaignOptimisation_Target>(
      AdCampaignOptimisation_Target.revenue
    );

  // To convert date into ISO Date formate

  const myDate = new Date(adPublishDate);
  let isoDate = "";

  if (isNaN(myDate.getTime())) {
    // handle invalid date
    console.error("Invalid date");
  } else {
    isoDate = myDate.toISOString(); // returns an ISO date string
  }

  const onSubmitCreateAdCampaign = async () => {
    try {
      const payload: CreateAdCampaignProps = {
        ad_date: isoDate,
        source: adSource,
        attributed_conversions: parseInt(attributeConversions),
        attributed_revenue: parseInt(attributedRevenue),
        type: adCampaignType,
        spends: parseInt(adCampaignspends),
        partition_id: partitionId,
        optimisation_target: optimisationTarget,
      };

      const res = await createAdCampaign(payload);

      if (res) {
        toast.success("Post created successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        resetInputFields();
        loadAdCampaign();
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const resetInputFields = () => {
    setAdPublishDate("");
    setAdSource("");
    setAttributedConversions("");
    setAttributedRevenue("");
    setAdCampaignType(AdCampaignType.baseline);
    setAdCampaignspends("");
    setPartitionId("");
    setOptimisationTarget(AdCampaignOptimisation_Target.revenue);
  };

  /****************************************/
  /********* Modal Box         ***********/
  /****************************************/

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /****************************************/
  /********* Choose Chart Types   *********/
  /****************************************/

  const [chooseChartType, setChooseChartType] = useState<ChartTypes>(
    ChartTypes.Bar_Chart
  );

  /****************************************/
  /********* Load Ad Campaing Data ********/
  /****************************************/

  const [adCampaignAllLists, setAdCampaignAllLists] = useState<
    AdCampaignProps[]
  >([]);
  const [adCampaignChartData, setAdCampaignChartData] = useState<
    AdCampaignProps[]
  >([]);

  const loadAdCampaign = async () => {
    try {
      const res = await getAdCampaignLists();

      if (res) {
        setAdCampaignAllLists(res.data.allAdCampaign);
        setAdCampaignChartData(res.data.adCampByMonth);
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  /****************************************/
  /*********To download excel file ********/
  /****************************************/

  const downloadExcel = () => {
    // Convert data to format used by SheetJS
    const sheetData = adCampaignAllLists.map((item) => ({
      ad_date: item.ad_date,
      attributed_revenue: item.attributed_revenue,
      source: item.source,
      spends: item.spends,
      attributed_conversions: item.attributed_conversions,
      type: item.type,
      partition_id: item.partition_id,
      optimisation_target: item.optimisation_target,
    }));

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate Excel file and download it
    const fileData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([fileData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ad_campaign.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    loadAdCampaign();
  }, []);

  return (
    <PageLayout>
      <div className={style.createButton}>
        <button className="btn btn-success" onClick={handleOpenModal}>
          Create AdCampaign
        </button>
      </div>
      <CardLayout>
        <div className="choose_chart">
          <select
            className={style.expenseChartSelection}
            value={chooseChartType}
            onChange={(e) => setChooseChartType(e.target.value as ChartTypes)}
          >
            {Object.keys(ChartTypes).map((chart_type, index) => (
              <option value={chart_type} key={index}>
                {chart_type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: "250px" }}>
          <Charts
            adExpenses={adCampaignChartData}
            chooseChartType={chooseChartType}
          />
        </div>
      </CardLayout>
      {/* //////////////////////////////////////////////////////////////////////// */}
      {/* ////                       To show list of ad                 ////////// */}
      {/* //////////////////////////////////////////////////////////////////////// */}

      <CardLayout>
        {/* List row heading */}

        <div className={style.downloadExcelButtonDesign}>
          <button className="btn btn-primary" onClick={downloadExcel}>
            Export Excel
          </button>
        </div>

        <CardLayout>
          <div className="row">
            <div className="col-xl-2 col-lg-1 col-md-12 col-sm-6">
              <h6>Ad Publish Date</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Conversions</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Revenue</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Target</h6>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
              <h6>Partition_id</h6>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
              <h6>Source</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Spends</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Type</h6>
            </div>
            <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
              <h6>Action</h6>
            </div>
          </div>
        </CardLayout>

        {adCampaignAllLists &&
          adCampaignAllLists.map((item) => (
            <AdListsCard adItems={item} adCampaignLists={loadAdCampaign} />
          ))}
      </CardLayout>

      {/* //////////////////////////////////////////////////////////////////////// */}
      {/* ////                       To create ad campaign              ////////// */}
      {/* //////////////////////////////////////////////////////////////////////// */}

      <ModalBox
        open={openModal}
        onCloseModal={handleCloseModal}
        title="Create AdCampaign"
        onSaveButton={onSubmitCreateAdCampaign}
        onResetButton={resetInputFields}
      >
        <label>Select Ad Date:</label>

        <div className="form-group">
          <input
            type="date"
            name="Name"
            className={style.expenseTitle}
            value={adPublishDate}
            onChange={(e) => setAdPublishDate(e.target.value)}
          />
        </div>

        <label>source:</label>

        <div className="form-group">
          <input
            type="text"
            name="Name"
            className={style.expenseTitle}
            value={adSource}
            onChange={(e) => setAdSource(e.target.value)}
          />
        </div>

        <label>attributed_conversions:</label>

        <div className="form-group">
          <input
            type="number"
            name="Name"
            className={style.expenseTitle}
            value={attributeConversions}
            onChange={(e) => setAttributedConversions(e.target.value)}
          />
        </div>

        <label>Attributed Revenue:</label>

        <div className="form-group">
          <input
            type="number"
            name="Name"
            className={style.expenseTitle}
            value={attributedRevenue}
            onChange={(e) => setAttributedRevenue(e.target.value)}
          />
        </div>

        <label>Ad Type:</label>

        <div className="selected-dropdownlist">
          <select
            className={style.expenseTitle}
            value={adCampaignType}
            onChange={(e) =>
              setAdCampaignType(e.target.value as AdCampaignType)
            }
          >
            {Object.keys(AdCampaignType).map((t, index) => (
              <option value={t} key={index}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <label>Spends:</label>

        <div className="form-group">
          <input
            type="number"
            name="Name"
            className={style.expenseTitle}
            value={adCampaignspends}
            onChange={(e) => setAdCampaignspends(e.target.value)}
          />
        </div>

        <label>Partition Id:</label>

        <div className="form-group">
          <input
            type="text"
            name="Name"
            className={style.expenseTitle}
            value={partitionId}
            onChange={(e) => setPartitionId(e.target.value)}
          />
        </div>

        <label>Optimisation Target:</label>

        <div className="selected-dropdownlist">
          <select
            className={style.expenseTitle}
            value={optimisationTarget}
            onChange={(e) =>
              setOptimisationTarget(
                e.target.value as AdCampaignOptimisation_Target
              )
            }
          >
            {Object.keys(AdCampaignOptimisation_Target).map((t, index) => (
              <option value={t} key={index}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </ModalBox>
    </PageLayout>
  );
};

export default Home;
