import { LoginForm } from '@/components/admin/login-form'
import { PageHeader } from '@/components/layout/page-header'

export default function AdminLoginPage() {
  return (
    <div>
      <PageHeader title="Admin" subtitle="Iniciar sesion" />
      <div className="px-4">
        <LoginForm />
      </div>
    </div>
  )
}
