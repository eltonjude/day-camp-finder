import { useEffect, useMemo } from 'react'
import { copy } from '../copy'
import type { Booking } from '../types'
import { isAboutOneWeekAway, parseIsoDate } from '../utils/dates'

function campDate(booking: Booking): Date | null {
  return parseIsoDate(booking.camp.startDate) ?? parseIsoDate(booking.dateFrom)
}

function registrationDate(booking: Booking): Date | null {
  return parseIsoDate(booking.camp.registrationStartDate)
}

export function dueCampReminders(bookings: Booking[]): Booking[] {
  return bookings.filter((booking) => {
    if (!booking.notify || booking.campRemindedAt) return false
    const start = campDate(booking)
    return start ? isAboutOneWeekAway(start) : false
  })
}

export function dueRegistrationReminders(bookings: Booking[]): Booking[] {
  return bookings.filter((booking) => {
    if (!booking.notify || booking.registrationRemindedAt) return false
    const opens = registrationDate(booking)
    return opens ? isAboutOneWeekAway(opens) : false
  })
}

async function sendNotice(title: string, body: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/favicon.svg' })
  } catch {
    // Some browsers only allow this from a service worker; the in-app banner still helps.
  }
}

export function useReminders(
  bookings: Booking[],
  markCampReminded: (id: string) => void,
  markRegistrationReminded: (id: string) => void,
) {
  const campDue = useMemo(() => dueCampReminders(bookings), [bookings])
  const registrationDue = useMemo(() => dueRegistrationReminders(bookings), [bookings])

  useEffect(() => {
    for (const booking of campDue) {
      void sendNotice(copy.reminder.title, copy.reminder.campBody(booking.camp.name))
      markCampReminded(booking.id)
    }
    for (const booking of registrationDue) {
      void sendNotice(copy.reminder.title, copy.reminder.registrationBody(booking.camp.name))
      markRegistrationReminded(booking.id)
    }
  }, [campDue, registrationDue, markCampReminded, markRegistrationReminded])

  return { campDue, registrationDue }
}

export async function requestNotifyPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}
