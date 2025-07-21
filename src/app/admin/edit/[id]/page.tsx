import { ProtectedAdmin } from '@/components/admin/ProtectedAdmin';
import { EditPostClient } from './EditPostClient';

interface EditPostProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostProps) {
  const resolvedParams = await params;
  return (
    <ProtectedAdmin>
      <EditPostClient params={resolvedParams} />
    </ProtectedAdmin>
  );
}