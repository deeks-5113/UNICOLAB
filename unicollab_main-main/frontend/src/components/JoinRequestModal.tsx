import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { toast } from 'sonner'

interface JoinRequestModalProps {
    projectId: string
    disabled?: boolean
}

export function JoinRequestModal({ projectId, disabled }: JoinRequestModalProps) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message to the creator.')
            return
        }

        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("You must be logged in to apply.")
            return
        }

        try {
            setLoading(true)
            await api.post('/requests/send', {
                project_id: projectId,
                message: message
            })

            toast.success('Join request sent successfully!')
            setOpen(false)
            setMessage('')
        } catch (error: any) {
            toast.error(error.response?.data?.detail || error.message || 'Failed to send join request.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled} className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white rounded-full px-6 flex items-center gap-2">
                    Request to Join <span>→</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Join Project</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Write a brief message to the project creator explaining why you'd be a good fit for this team.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="I have experience in React and I'd love to contribute..."
                        className="min-h-[120px] bg-secondary border-border text-foreground"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        {loading ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
