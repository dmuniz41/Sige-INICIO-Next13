'use client'
import { Menu } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Sider from 'antd/es/layout/Sider'
import type { MenuProps } from 'antd'

// Type for menu items
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return { key, icon, children, label, type } as MenuItem
}

// SVG icons moved to separate components for better readability
const SecurityIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
  </svg>
)

const HumanResourcesIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
)

const WarehouseSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M3 21v-13l9 -4l9 4v13"></path>
    <path d="M13 13h4v8h-10v-6h6"></path>
    <path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3"></path>
  </svg>
)

// Add similar icon components for other menu items...

const items: MenuItem[] = [
  getItem('Usuarios', 'security', SecurityIcon, [
    getItem(<Link href="/dashboard/users">Usuarios</Link>, 'users'),
  ]),
  getItem('Recursos Humanos', 'employees', HumanResourcesIcon, [
    getItem(<Link href="/dashboard/employees">Trabajador</Link>, 'employees'),
  ]),
  getItem('Almacenes', 'warehouse', WarehouseSvg, [
    getItem(<Link href="/dashboard/warehouse">Almacen</Link>, 'warehouses'),
  ]),
  getItem('Nomencladores', 'nomenclators', HumanResourcesIcon, [
    getItem(
      <Link href="/dashboard/nomenclators/unitMeasures">Unidades de medida</Link>,
      'unitMeasures',
    ),
    getItem(<Link href="/dashboard/nomenclators/workArea">Area de trabajo</Link>, 'workArea'),
    getItem(<Link href="/dashboard/nomenclators/serviceFee">Tarifas</Link>, 'serviceFee'),
    getItem(<Link href="/dashboard/nomenclators/providers">Proveedores</Link>, 'providers'),
    getItem(
      <Link href="/dashboard/nomenclators/priceUnitMeasure">Precio/Unidad de medida</Link>,
      'priceUnitMeasure',
    ),
    getItem(<Link href="/dashboard/nomenclators/materials">Materiales</Link>, 'materials'),
  ]),
]

export const Sidebar = () => {
  const pathname = usePathname()

  const selectedKey =
    items
      .flatMap((item: any) => item?.children || [item])
      .find((child) => child?.key === pathname.split('/').pop())
      ?.key?.toString() || ''

  return (
    <Sider
      width={250}
      breakpoint="lg"
      collapsedWidth="0"
      theme="light"
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        // defaultOpenKeys={['security', 'humanResources']}
        style={{
          height: '100%',
          borderRight: 0,
          fontWeight: 500,
        }}
        items={items}
      />
    </Sider>
  )
}
