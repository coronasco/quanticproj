'use client'

import { 
    Breadcrumb, 
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

const IncomeBreadcrumb = () => {
  return (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/income">Incasso</BreadcrumbLink>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
  )
}

export default IncomeBreadcrumb