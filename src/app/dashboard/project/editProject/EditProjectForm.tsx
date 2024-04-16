"use client";
import { Form, Select, SelectProps, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { AddItemModal } from "../createProject/AddItem";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { IItem, IProject } from "@/models/project";
import { INomenclator } from "@/models/nomenclator";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { startUpdateProject } from "@/actions/project";
import { useAppDispatch } from "@/hooks/hooks";
import Table, { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";

export const EditProjectForm = () => {
  const [addItemModal, setAddItemModal] = useState(false);
  const [form] = Form.useForm();
  const [itemsValues, setItemsValues]: any = useState([]);
  const currencyNomenclators: string[] | undefined = [];
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  const { selectedProject }: { selectedProject: IProject } = useAppSelector(
    (state: RootState) => state.project
  );
  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );
  
  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(clientNomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    setItemsValues(selectedProject.itemsList);
  }, [dispatch, selectedProject]);
  
  const [clientNumber, setClientNumber] = useState(selectedProject.clientNumber);
  const [clientName, setClientName] = useState(selectedProject?.clientName);

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Moneda") currencyNomenclators.push(nomenclator.code);
  });

  const clientNameOptions: SelectProps["options"] = clientNomenclators.map((client) => {
    return {
      label: `${client.name}`,
      value: `${client.name}`
    };
  });

  const currencyOptions: SelectProps["options"] = currencyNomenclators.map((currency) => {
    return {
      label: `${currency}`,
      value: `${currency}`
    };
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddItem = (values: any) => {
    setItemsValues([...itemsValues, values]);
    setAddItemModal(false);
  };

  return (
    <Form
      form={form}
      name="editProjectForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
      fields={[
        {
          name: "clientName",
          value: clientName
        },
        {
          name: "projectName",
          value: selectedProject.projectName
        },
        {
          name: "currency",
          value: selectedProject.currency
        },
        {
          name: "itemList",
          value: itemsValues
        }
      ]}
    >
      <section className=" flex-col mb-4">
        <article className="grid gap-4">
          <div className="grid w-[50%]">
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Nombre del Cliente</span>}
              name="clientName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={clientNameOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onSelect={(value: string) => {
                  setClientName(value)
                  clientNomenclators.map((client) => {
                    client.name === value && setClientNumber(client.idNumber);
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Proyecto</span>}
              name="projectName"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Moneda </span>}
              name="currency"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={currencyOptions}
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </div>
          <TableFormSection
            sectionName="Servicios"
            values={itemsValues}
            formName="itemList"
            valuesSetter={setItemsValues}
            addModalSetter={setAddItemModal}
            buttonText="Añadir Servicio"
            form={form}
          />
        </article>
      </section>
      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none "
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                console.log("🚀 ~ .then ~ values:", values);
                dispatch(
                  startUpdateProject({
                    ...values,
                    clientNumber: clientNumber,
                    _id: selectedProject._id,
                    itemsList: itemsValues
                  })
                );
                form.resetFields();
                router.push(`/dashboard/project/${selectedProject._id}`);
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Editar
        </button>
      </Form.Item>
      <AddItemModal
        open={addItemModal}
        onCancel={() => setAddItemModal(false)}
        onCreate={onAddItem}
      />
    </Form>
  );
};

const TableFormSection = (props: any) => {
  const {
    sectionName,
    values,
    valuesSetter,
    addModalSetter,
    // editModalSetter,
    // valueToEditSetter,
    buttonText
  } = props;

  const handleDelete = (record: IItem) => {
    valuesSetter(values.filter((value: IItem) => value.description !== record.description));
  };
  // const handleEdit = (record: IServiceFeeSubItem) => {
  //   valueToEditSetter(record);
  //   editModalSetter(true);
  // };

  const columns: ColumnsType<IItem> = [
    {
      title: <span className="font-bold">No.</span>,
      key: "idNumber",
      width: "2%",
      render: (text, record, index) => <span className="flex justify-center">{index + 1}</span>
    },
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "95%"
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {/* <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={18} height={18} />
            </button>
          </Tooltip> */}
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <section className=" flex w-full mb-8 rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] h-full p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-bold">{sectionName?.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={values}
          className="shadow-sm"
          sortDirections={["ascend"]}
          pagination={false}
          bordered
        />
        <button
          className="add-item-form-btn"
          onClick={() => {
            addModalSetter(true);
          }}
        >
          <PlusSvg width={20} height={20} />
          {buttonText}
        </button>
      </div>
    </section>
  );
};
