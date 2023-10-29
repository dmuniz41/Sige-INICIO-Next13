"use client";
import { ICostSheet } from "@/models/costSheet";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Form, Input, InputNumber } from "antd";
import React from "react";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const CreateCostSheetForm = () => {
  return (
    <Form
      name="createCostSheetForm"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 0 }}
      className="w-full flex flex-col gap-0"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark={"optional"}
      size="middle"
    >
      <Form.Item className="mb-1" label={<span className="font-bold text-md">Tarea a ejecutar</span>} name="taskName" rules={[{ required: true, message: "Introduzca el nombre de la tarea" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        className="mb-1"
        label={<span className="font-bold text-md">Cantidad de empleados</span>}
        name="workersAmount"
        rules={[{ required: true, message: "Introduzca el nombre de la tarea" }]}
      >
        <InputNumber className="w-full" />
      </Form.Item>
      <section className=" flex flex-col w-full">
        <label className="text-md font-bold mb-3" htmlFor="rawMaterials">
          Materias Primas Fundamentales
        </label>
        <Form.List name="rawMaterials">
          {(fields, { add, remove }) => (
            <div className="flex flex-col w-full">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full">
                  <div className="flex items-center flex-row mb-0 h-9 w-full">
                    <Form.Item className="w-full" {...restField} name={[name, "description"]} rules={[{ required: true, message: "Introduzca la descripción" }]}>
                      <Input placeholder="Descripción" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "unitMeasure"]} rules={[{ required: true, message: "Introduzca la unidad de medida" }]}>
                      <Input placeholder="Unidad de Medida" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "amount"]} rules={[{ required: true, message: "Introduzca la cantidad" }]}>
                      <InputNumber placeholder="Cantidad" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "price"]} rules={[{ required: true, message: "Introduzca el precio" }]}>
                      <Input placeholder="Precio" className="w-full" />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button className="flex flex-row justify-center items-center " type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add field
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </section>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="bg-success-500 cursor-pointer hover:bg-success-600 ease-in-out duration-300 w-[5rem] h-[2rem] flex items-center p-1 text-sm font-bold text-white-100  justify-center gap-2 rounded-md "
        >
          Crear
        </Button>
      </Form.Item>
    </Form>
  );
};
