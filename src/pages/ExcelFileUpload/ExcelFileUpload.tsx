import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import style from "./ExcelFileUpload.module.scss";
import PageLayout from "../../layouts/PageLayout";
import CardLayout from "../../components/CardLayout/CardLayout";
import ExcelAdDataCard from "./ExcelAdDataCard";
import {
  uploadExcelFileAdCampaign,
  getExcelSheetUploadedData,
  getExcelDatatoShowinChart,
  deleteAllExcelData,
  getExcelDataBySearchFilter,
} from "../../services/API";
import {
  AdCampaignExcelDataProps,
  ChartTypes,
  AdCampaignType,
  AdCampaignOptimisation_Target,
} from "../../services/DataProvider";
import ExcelDataChart from "../../components/Charts/ExcelDataChart";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const ExcelFileUpload = () => {
  /****************************************/
  /****** To upload Excel file dat *******/
  /****************************************/

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (!file) {
        setLoading(false);
        toast.error("Please select a file", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadExcelFileAdCampaign(formData);
      if (response) {
        toast.success("Post created successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        loadAllExcelData();
        loadExcelDataForChart();
        //to clear the file name as soon as file data uploaded
        setFile(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // clear file input value
        }
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  /****************************************/
  /****** To load excel Data **************/
  /****************************************/

  const [limit, setLimit] = useState<number>(10);

  const [allExcelData, setAllExcelData] = useState<AdCampaignExcelDataProps[]>(
    []
  );

  const loadAllExcelData = async () => {
    try {
      const res = await getExcelSheetUploadedData(limit);

      if (res) {
        setAllExcelData(res.data.allData);
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleLoadMorePagination = () => {
    setLimit((prev) => prev + 10);
  };

  /****************************************/
  /* To Load Excel Data By Search Filter  */
  /****************************************/

  const [type, setType] = useState<AdCampaignType>(AdCampaignType.baseline);

  const [adTarget, setAdTarget] = useState<AdCampaignOptimisation_Target>(
    AdCampaignOptimisation_Target.revenue
  );

  const loadExcelDataBySearchFilter = async () => {
    try {
      const res = await getExcelDataBySearchFilter(type, adTarget);
      if (res) {
        setAllExcelData(res.data.searchResult);
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  /****************************************/
  /* To load excel Data to show in chart **/
  /****************************************/

  const [excelDataForType, setExcelDataForType] = useState<
    AdCampaignExcelDataProps[]
  >([]);
  const [excelDataForOptimizationTarget, setExcelDataForOptimizationTarget] =
    useState<AdCampaignExcelDataProps[]>([]);

  const [totalAdPosts, setTotalAdPosts] = useState<number>();

  const loadExcelDataForChart = async () => {
    try {
      const res = await getExcelDatatoShowinChart();

      if (res) {
        setExcelDataForType(res.data.adTypeData);
        setExcelDataForOptimizationTarget(res.data.adOptimisationTargetData);
        setTotalAdPosts(res.data.totalAdPosts);
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  /****************************************/
  /****** Tab option for items*************/
  /****************************************/
  //This function is to set tab value,.when user click one option it set one interger value

  const [adDataChartType, setAdDataChartType] = useState<number>(1);

  const handleChartTypeTab = (position: number) => {
    setAdDataChartType(position);
  };

  /****************************************/
  /********* Choose Chart Types   *********/
  /****************************************/

  const [chooseChartType, setChooseChartType] = useState<ChartTypes>(
    ChartTypes.Bar_Chart
  );

  /****************************************/
  /********* To delete all excel data *****/
  /****************************************/

  const onClickDeleteAllExcelData = async () => {
    try {
      const res = await deleteAllExcelData();

      if (res) {
        toast.success("All Data Deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        loadAllExcelData();
        loadExcelDataForChart();
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  /****************************************/
  /*Delete Post Confirm Modal Box        **/
  /****************************************/

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
  };

  /****************************************/
  /*********To download excel file ********/
  /****************************************/

  const downloadExcel = () => {
    // Convert data to format used by SheetJS
    const sheetData = allExcelData.map((item) => ({
      date: item.date,
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
    loadAllExcelData();
    loadExcelDataForChart();
  }, [limit, type, adTarget]);

  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     if (!file) {
  //       return;
  //     }
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const response = await fetch("http://localhost:8080/api/v0/excel-file-upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       console.log("Data uploaded successfully");

  //       toast.success("Post created successfully", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } else {
  //       console.error("Error uploading data");
  //     }
  //   };

  return (
    <PageLayout>
      <CardLayout>
        <form onSubmit={handleSubmit}>
          <label>
            Choose a file:
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            {loading ? "Uploading file..." : "Upload"}
          </button>
        </form>
      </CardLayout>

      {/* To show chart */}

      <CardLayout>
        {/* //////////////////////////////////////////////////////////////////////// */}
        {/* ////                     Tab options                //////////////////// */}
        {/* //////////////////////////////////////////////////////////////////////// */}

        <div className={style.selectChartDataTab}>
          <div
            className={
              adDataChartType === 1
                ? style.expenseCategoryButtonActive
                : style.expenseCategoryButton
            }
            onClick={() => handleChartTypeTab(1)}
          >
            <h6>Ad Types</h6>
          </div>

          {/* Chart to show expenses based on each date */}
          <div
            className={
              adDataChartType === 2
                ? style.expenseTotalExpenseButtonActive
                : style.expenseTotalExpenseButton
            }
            onClick={() => handleChartTypeTab(2)}
          >
            <h6> Optimisation Target</h6>
          </div>
        </div>

        {adDataChartType === 1 && (
          <>
            <div className="choose_chart">
              <select
                className={style.expenseChartSelection}
                value={chooseChartType}
                onChange={(e) =>
                  setChooseChartType(e.target.value as ChartTypes)
                }
              >
                {Object.keys(ChartTypes).map((chart_type, index) => (
                  <option value={chart_type} key={index}>
                    {chart_type}
                  </option>
                ))}
              </select>
            </div>
            <ExcelDataChart
              adExpenses={excelDataForType}
              chooseChartType={chooseChartType}
            />
          </>
        )}

        {adDataChartType === 2 && (
          <>
            <div className="choose_chart">
              <select
                className={style.expenseChartSelection}
                value={chooseChartType}
                onChange={(e) =>
                  setChooseChartType(e.target.value as ChartTypes)
                }
              >
                {Object.keys(ChartTypes).map((chart_type, index) => (
                  <option value={chart_type} key={index}>
                    {chart_type}
                  </option>
                ))}
              </select>
            </div>
            <ExcelDataChart
              adExpenses={excelDataForOptimizationTarget}
              chooseChartType={chooseChartType}
            />
          </>
        )}
      </CardLayout>

      {/* //////////////////////////////////////////////////////////////////////// */}
      {/* ////                    List of all ad               //////////////////// */}
      {/* //////////////////////////////////////////////////////////////////////// */}

      <CardLayout>
        <div className={style.itemContainer}>
          <h6>Total Ad Campaign: {totalAdPosts}</h6>
        </div>
        {/* Search Filter Option */}
        <div className={style.searchFilterandActionContainer}>
          <div className={style.searchFilterItemContainer}>
            <div className={style.seletTypeDesign}>
              <h6>Type</h6>
              <select
                className={style.expenseTitle}
                value={type}
                onChange={(e) => setType(e.target.value as AdCampaignType)}
              >
                {Object.keys(AdCampaignType).map((t, index) => (
                  <option value={t} key={index}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.seletTargetDesign}>
              <h6>Target</h6>

              <select
                className={style.expenseTitle}
                value={adTarget}
                onChange={(e) =>
                  setAdTarget(e.target.value as AdCampaignOptimisation_Target)
                }
              >
                {Object.keys(AdCampaignOptimisation_Target).map((t, index) => (
                  <option value={t} key={index}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.filterDataButton}>
              <h6>Filter</h6>
              <button
                onClick={loadExcelDataBySearchFilter}
                className="btn btn-primary"
              >
                Search
              </button>
              <p>results-{allExcelData.length}</p>
            </div>
          </div>

          {allExcelData.length > 0 && (
            <div className={style.buttonContainer}>
              <button className="btn btn-danger" onClick={handleOpenModal}>
                Delete All
              </button>

              <button className="btn btn-success" onClick={downloadExcel}>
                Exports
              </button>
            </div>
          )}
        </div>
      </CardLayout>

      {/* List Row Heading */}

      <CardLayout>
        <div className="row">
          <div className="col-xl-2 col-lg-1 col-md-12 col-sm-6">
            <h6>Ad Publish Date</h6>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>Revenue</h6>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>Optimisation Target</h6>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>Spends</h6>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>Type</h6>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>Action</h6>
          </div>
        </div>
      </CardLayout>

      {/* To show all the data in the card */}

      <CardLayout>
        {allExcelData &&
          allExcelData.map((item) => (
            <ExcelAdDataCard
              addData={item}
              loadAllExcelData={loadAllExcelData}
              loadAllExcelSheetChartData={loadExcelDataForChart}
              key={item._id}
            />
          ))}

        <div className={style.postCountContainer}>
          <div className={style.postCountDesign}>
            <h6>
              {allExcelData?.length} of {totalAdPosts}
            </h6>
          </div>
        </div>
        {/* To load data - Load more pagination */}
        {allExcelData.length > 0 && (
          <div className={style.loadMoreButtonContainer}>
            <div
              className={style.loadMoreButton}
              onClick={handleLoadMorePagination}
            >
              <span>Load More</span>
            </div>
          </div>
        )}
      </CardLayout>

      {/* To show confirm modal box to delete post */}

      <ConfirmModal
        title="Delete all the posts"
        open={openConfirmModal}
        onCloseModal={handleCloseModal}
        confirmDelete={onClickDeleteAllExcelData}
      >
        <h6>Are you sure you want to delete all the posts?</h6>
      </ConfirmModal>
    </PageLayout>
  );
};

export default ExcelFileUpload;
