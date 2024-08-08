"use client";
import { ColumnsType } from "antd/es/table";
import { DatePicker, Form, Select, SelectProps, Table, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

import { AddItemModal } from "./AddItem";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { editItemList, startAddProject } from "@/actions/project";
import { EditItemModal } from "./EditItem";
import { EditSvg } from "@/app/global/EditSvg";
import { IClientNomenclator } from "@/models/nomenclators/client";
import { INomenclator } from "@/models/nomenclator";
import { IOfferItem } from "@/models/offer";
import { IProject } from "@/models/project";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";

export const CreateProjectForm = () => {
    const [representative, setRepresentative] = useState("");
  const [addItemModal, setAddItemModal] = useState(false);
  const [clientNumber, setClientNumber] = useState(0);
  const [editItemModal, setEditItemModal] = useState(false);
  const [form] = Form.useForm();
  const [itemsValues, setItemsValues]: any = useState([]);
  const [rowToEdit, setRowToEdit] = useState<IOfferItem>();
  const currencyNomenclators: string[] | undefined = [];
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(nomenclatorsStartLoading());
    dispatch(clientNomenclatorsStartLoading());
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(representativeNomenclatorsStartLoading());
  }, [dispatch]);

  const { projects }: { projects: IProject[] } = useAppSelector((state: RootState) => state?.project);

  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector((state: RootState) => state?.nomenclator);

  const { clientNomenclators }: { clientNomenclators: IClientNomenclator[] } = useAppSelector((state: RootState) => state?.nomenclator);

  const { representativeNomenclators }: { representativeNomenclators: IRepresentativeNomenclator[] } = useAppSelector(
    (state: RootState) => state?.nomenclator
  );

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

  const representativeOptions: SelectProps["options"] = representativeNomenclators?.map((representative) => {
    return {
      label: `${representative?.name}`,
      value: `${representative?.name}`
    };
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onAddItem = (values: any) => {
    setItemsValues([...itemsValues, values]);
    setAddItemModal(false);
  };

  const onEditItem = (values: any) => {
    const newItemList: IOfferItem[] = [];
    itemsValues.forEach((value: any) => {
      if (value._id === values._id) {
        newItemList.push({
          ...value,
          description: values.description
        });
      } else {
        newItemList.push(value);
      }
    });
    dispatch(editItemList(newItemList));
    setItemsValues(newItemList);
    setEditItemModal(false);
  };

  return (
    <Form
      form={form}
      name="createProjectForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <section className="flex-col mb-4 shadow-md p-4">
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
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onSelect={(value) => {
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
              rules={[
                { required: true, message: "Campo requerido" },
                {
                  message: "Ya existe un proyecto con ese nombre",
                  validator: (_, value: string) => {
                    if (!projects.some((project) => project?.projectName?.trim().toLowerCase() === value?.trim().toLowerCase())) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Ya existe un proyecto con ese nombre");
                    }
                  }
                }
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Fecha de creación</span>}
              name="initDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              className="mb-3"
              label={<span className="font-bold text-md">Fecha en la que se necesita el servicio</span>}
              name="deliveryDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker />
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
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-bold text-md">Representación</span>}
              name="representative"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select
                allowClear
                options={representativeOptions}
                showSearch
                onSelect={(value) => {
                  setRepresentative(value);
                }}
                optionFilterProp="children"
                filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
              />
            </Form.Item>
          </div>
          <TableFormSection
            sectionName="Servicios"
            values={itemsValues}
            formName="itemsList"
            valuesSetter={setItemsValues}
            addModalSetter={setAddItemModal}
            editModalSetter={setEditItemModal}
            valueToEditSetter={setRowToEdit}
            buttonText="Añadir Servicio"
            form={form}
          />
        </article>
      </section>
      <Form.Item>
        <button
          type="submit"
          className="mt-4 select-none rounded-lg bg-success-500 py-3 px-6 text-center align-middle text-sm font-bold uppercase text-white-100 shadow-md shadow-success-500/20 transition-all hover:shadow-lg hover:shadow-success-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(
                  startAddProject({
                    ...values,
                    itemsList: itemsValues,
                    clientNumber: clientNumber,
                    status: "Pendiente de Oferta",
                    expenses: 0,
                    profits: 0,
                    totalValue: 0,
                    initDate: values.initDate.format("MM/DD/YYYY"),
                    deliveryDate: values.deliveryDate.format("MM/DD/YYYY"),
                    payMethod:representative
                  })
                );
                router.push("/dashboard/project");
              })
              .catch((error) => {
                console.log("Validate Failed:", error);
              });
          }}
        >
          Crear
        </button>
      </Form.Item>
      <AddItemModal open={addItemModal} onCancel={() => setAddItemModal(false)} onCreate={onAddItem} itemsList={itemsValues} />
      <EditItemModal
        open={editItemModal}
        onCancel={() => setEditItemModal(false)}
        onCreate={onEditItem}
        defaultValues={rowToEdit}
        itemsList={itemsValues}
      />
    </Form>
  );
};

const TableFormSection = (props: any) => {
  const { sectionName, values, valuesSetter, addModalSetter, editModalSetter, valueToEditSetter, buttonText } = props;

  const handleDelete = (record: IOfferItem) => {
    valuesSetter(values.filter((value: IOfferItem) => value.description !== record.description));
  };
  const handleEdit = (record: IOfferItem) => {
    valueToEditSetter(record);
    editModalSetter(true);
  };

  const columns: ColumnsType<IOfferItem> = [
    {
      title: <span className="font-bold">No.</span>,
      width: "5%",
      align: "center",
      render: (text, record, index) => index + 1
    },
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "90%"
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={18} height={18} />
            </button>
          </Tooltip>
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
    <section className=" flex w-full rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex px-7 h-full text-center items-center justify-center bg-[#fafafa] rounded-l-md">
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
