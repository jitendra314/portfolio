import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

/**
 * Generic CRUD hook for admin pages.
 * @param {string} queryKey   - React Query key
 * @param {object} api        - { getAll, create, update, remove }
 */
export function useCrud(queryKey, api) {
  const qc = useQueryClient()
  const [editing, setEditing]   = useState(null)  // item being edited (or null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)  // id being deleted

  const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn: api.getAll })
  const items = data?.data?.data ?? []

  const invalidate = () => qc.invalidateQueries({ queryKey: [queryKey] })

  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => { toast.success('Created successfully'); setCreating(false); invalidate() },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error creating'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.update(id, data),
    onSuccess: () => { toast.success('Updated successfully'); setEditing(null); invalidate() },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error updating'),
  })

  const deleteMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => { toast.success('Deleted'); setDeleting(null); invalidate() },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error deleting'),
  })

  return {
    items, isLoading,
    editing, setEditing,
    creating, setCreating,
    deleting, setDeleting,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    creating_loading: createMutation.isPending,
    updating_loading: updateMutation.isPending,
    deleting_loading: deleteMutation.isPending,
  }
}
