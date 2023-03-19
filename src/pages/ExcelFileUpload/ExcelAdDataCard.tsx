import React, { FC, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { CgArrowsExpandRight } from "react-icons/cg";

import style from "./ExcelAdDataCard.module.scss";
import CardLayout from "../../components/CardLayout/CardLayout";
import { AdCampaignExcelDataProps } from "../../services/DataProvider";
import { deleteSingleExcelSheetData } from "../../services/API";
import ModalBox from "../../components/Modal/ModalBox";

interface ExcelAdDataCardProps {
  addData: AdCampaignExcelDataProps;
  loadAllExcelData: () => void;
  loadAllExcelSheetChartData: () => void;
}

const ExcelAdDataCard: FC<ExcelAdDataCardProps> = ({
  addData,
  loadAllExcelData,
  loadAllExcelSheetChartData,
}) => {
  /****************************************/
  /****** To delete Single ad Data *********/
  /****************************************/

  const onClickDeleteSingleExcelSheetData = async () => {
    try {
      const res = await deleteSingleExcelSheetData(addData._id);
      if (res) {
        toast.success("Ad Deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        loadAllExcelData();
        loadAllExcelSheetChartData();
      }
    } catch (error: any) {
      toast.error(error.response && error.response.data.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
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

  return (
    <>
      {/* /////////////////////////////////////////////////////////////////////// */}
      {/* ////                    Data Card design             /////////////////// */}
      {/* //////////////////////////////////////////////////////////////////////// */}

      <div className={style.cardContainer}>
        <div className="row">
          <div className="col-xl-2 col-lg-1 col-md-12 col-sm-6">
            <h6>{moment(addData.date).format("MMM Do YY")}</h6>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>{addData.attributed_revenue}.EUR</h6>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>{addData.optimisation_target}</h6>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>{addData.spends}</h6>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-12 col-sm-6">
            <h6>{addData.type}</h6>
          </div>

          <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
            <span onClick={handleOpenModal} className={style.iconDesign}>
              <CgArrowsExpandRight size={25} color="green" />
            </span>
          </div>

          <div className="col-xl-1 col-lg-2 col-md-12 col-sm-6">
            <button
              className="btn btn-danger"
              onClick={onClickDeleteSingleExcelSheetData}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* /////////////////////////////////////////////////////////////////////// */}
      {/* ////                   Modal to show details post         ////////////// */}
      {/* //////////////////////////////////////////////////////////////////////// */}

      <ModalBox
        title="Ad Campaign Details"
        open={openModal}
        onCloseModal={handleCloseModal}
      >
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Date</h6>
              <p>{moment(addData.date).format("MMM Do YY")}</p>
            </CardLayout>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Attributed Revenue</h6>
              <p>{addData.attributed_revenue}</p>
            </CardLayout>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Attributed Conversions</h6>
              <p>{addData.attributed_conversions}</p>
            </CardLayout>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Optimisation Target</h6>
              <p>{addData.optimisation_target}</p>
            </CardLayout>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Source</h6>
              <p>{addData.source}</p>
            </CardLayout>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Spends</h6>
              <p>{addData.spends}</p>
            </CardLayout>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Type</h6>
              <p>{addData.type}</p>
            </CardLayout>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <CardLayout>
              <h6>Partition Id</h6>
              <p>{addData.partition_id}</p>
            </CardLayout>
          </div>
        </div>
      </ModalBox>
    </>
  );
};

export default ExcelAdDataCard;
