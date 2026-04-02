import { createFileRoute } from '@tanstack/react-router'
import { pageQueryOptions } from '#/lib/queries'
import { Editor } from '#/features/editor/components/Editor'

export const Route = createFileRoute('/app/pages/$id')({
  component: PageEditorRoute,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(pageQueryOptions(id)),
})

function PageEditorRoute() {
  const { id } = Route.useParams()
  return <Editor id={id} />
}
