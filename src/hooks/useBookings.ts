import { useCallback, useEffect, useState } from 'react'
import type { Booking, CampResult, CampSource } from '../types'

const STORAGE_KEY = 'campquest:bookings'

function load(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

export interface BookingDraft {
  camp: CampResult
  sources: CampSource[]
  area: string
  session: string
  year: number
  dateFrom: string
  dateTo: string
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  }, [bookings])

  const addBooking = (draft: BookingDraft): Booking => {
    const existing = bookings.find(
      (b) => b.camp.name === draft.camp.name && b.area === draft.area && b.year === draft.year,
    )
    if (existing) return existing

    const created: Booking = {
      id: crypto.randomUUID(),
      ...draft,
      notify: false,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [created, ...prev])
    return created
  }

  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  const setNotify = (id: string, notify: boolean) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, notify } : b)))
  }

  const markCampReminded = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, campRemindedAt: new Date().toISOString() } : b)),
    )
  }, [])

  const markRegistrationReminded = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, registrationRemindedAt: new Date().toISOString() } : b)),
    )
  }, [])

  const isBooked = (campName: string, area: string, year: number) =>
    bookings.some((b) => b.camp.name === campName && b.area === area && b.year === year)

  return {
    bookings,
    addBooking,
    removeBooking,
    setNotify,
    markCampReminded,
    markRegistrationReminded,
    isBooked,
  }
}
