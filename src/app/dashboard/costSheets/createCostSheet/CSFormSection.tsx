import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber } from 'antd'
import React from 'react'

export const CSFormSection = (props: any) => {
  const {name, label} = props
  return (
    <section className=" flex flex-col w-full mb-0">
        <label className="text-md font-bold mb-3" htmlFor={`${name}`}>
          {label}
        </label>
        <Form.List name={`${name}`}>
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
              <Form.Item className='mb-2'>
                <Button className="flex flex-row justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir entrada
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </section>
  )
}
