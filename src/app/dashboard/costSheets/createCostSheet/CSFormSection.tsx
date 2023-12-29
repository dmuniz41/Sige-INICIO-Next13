import { INomenclator } from "@/models/nomenclator";
import { RootState, useAppSelector } from "@/store/store";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, SelectProps, Tooltip } from "antd";
import { HelpSvg } from '../../../global/HelpSvg';

export const CSFormSection = (props: any) => {
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);
  const { name, label, tooltip } = props;
  const unitMeasures: string[] | undefined = [];

  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Unidad de medida") unitMeasures.push(nomenclator.code);
  });

  const unitMeasure: SelectProps["options"] = unitMeasures.map((unitMeasure) => {
    return {
      label: `${unitMeasure}`,
      value: `${unitMeasure}`,
    };
  });

  return (
    <section className=" flex flex-col w-full mb-0">
      <div className="flex gap-1 ">
      <label className="text-md font-bold mb-3" htmlFor={`${name}`}>
        {label}
      </label>
        <Tooltip className="flex pt-[2px] text-white-700" title={tooltip}>
          <div><HelpSvg /></div>
        </Tooltip>
      </div>
      <Form.List name={`${name}`}>
        {(fields, { add, remove }) => (
          <div className="flex flex-col w-full">
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="w-full">
                <div className="flex items-center flex-row mb-0 h-9  gap-1">
                  <Form.Item className="w-[70%]" {...restField} name={[name, "description"]} rules={[{ required: true, message: "Introduzca la descripción" }]}>
                    <Input placeholder="Descripción" className="w-full" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "unitMeasure"]} className="w-[20%]" rules={[{ required: true, message: "Introduzca la unidad de medida" }]}>
                    <Select 
                      placeholder="Unidad de medida" 
                      allowClear 
                      options={unitMeasure} 
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input)}
                      filterSort={(optionA: any, optionB: any) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                      />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "amount"]} rules={[{ required: true, message: "Introduzca la cantidad" }]}>
                    <InputNumber placeholder="Cantidad"  />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "price"]} rules={[{ required: true, message: "Introduzca el precio" }]}>
                    <InputNumber placeholder="Precio" />
                  </Form.Item>
                  <MinusCircleOutlined className="mb-auto" onClick={() => remove(name)} />
                </div>
              </div>
            ))}
            <Form.Item className="mb-2 w-full">
              <Button className="flex flex-row  justify-center items-center" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Añadir entrada
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </section>
  );
};
