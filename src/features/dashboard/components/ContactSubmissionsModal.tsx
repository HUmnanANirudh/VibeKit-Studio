import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getContactSubmissions } from '#/lib/pages.functions'
import { Mail, User, MessageSquare, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface ContactSubmissionsModalProps {
  pageId: string
  pageTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactSubmissionsModal({
  pageId,
  pageTitle,
  open,
  onOpenChange,
}: ContactSubmissionsModalProps) {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['contact-submissions', pageId],
    queryFn: () => getContactSubmissions({ data: pageId }),
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <MessageSquare className="w-6 h-6 text-primary" />
            Messages for "{pageTitle}"
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                Loading messages...
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed">
              <Mail className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-bold">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                When users submit the contact form on your page, they will
                appear here.
              </p>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">
                      Sender
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">
                      Message
                    </TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s) => (
                    <TableRow
                      key={s.id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="align-top py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />{' '}
                            {s.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {s.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {s.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-right align-top py-4 text-[10px] whitespace-nowrap text-muted-foreground font-medium uppercase tracking-widest">
                        {format(new Date(s.createdAt), 'MMM d, h:mm a')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
