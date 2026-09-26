export function getAvailableBookingDays() {
  const slots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:30 PM']
  const days = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)

  while (days.length < 4) {
    cursor.setDate(cursor.getDate() + 1)
    const dow = cursor.getDay()
    // Few days a week: Mon / Wed / Fri
    if (![1, 3, 5].includes(dow)) continue
    days.push({
      key: cursor.toISOString().slice(0, 10),
      label: cursor.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      slots: [...slots],
    })
  }
  return days
}
