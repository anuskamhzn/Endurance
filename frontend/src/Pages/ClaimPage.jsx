"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Loader, Text, Group, Badge, Avatar, Card } from "@mantine/core"
import { useNavigate } from "react-router-dom"  // Removed unused useParams for now
import Navbar from "../Components/Navbar"
import ClaimSections from "../Components/ClaimSection"
import SubmitPaymentDrawer from "../Components/SubmitPaymentDrawer"

export default function ClaimPage() {
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [drawerOpened, setDrawerOpened] = useState(false)
  const navigate = useNavigate()
  const totals = claim?.totals || {}
  const invoiceTotal = totals.total || 0

  const fetchClaim = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/claims`)
      if (res.data && res.data.length > 0) {
        setClaim(res.data[0])  // Grab the first claim
      } else {
        throw new Error("No claims found")
      }
      setError(null)
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err.response?.data?.message || "Failed to load claim")
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      await fetchClaim()
      setLoading(false)
    }
    load()
  }, [])  // No dependency on 'id' since we're not using it

  const handleSubmitPayment = async (formData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/claims/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchClaim(); // Refetch to update the claim data
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Submit failed";
      throw new Error(errorMsg);  // Passes to SubmitPaymentDrawer for display
    }
  };

  if (loading) return <Loader size="xl" className="flex justify-center items-center h-screen" />

  if (error || !claim) {
    return (
      <div className="max-w-5xl mx-auto p-6 ">
        <Text color="red">Error: {error || "Claim not found"}</Text>
        
      </div>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} • ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`
  }

  const statusHistory = claim.statusHistory || []

  return (
    <div>
      <Navbar />

      {/* Main Content */}
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-6 ">
          <div className="flex items-center gap-2 mb-6">
            <Text size="sm" c='gray.8'>
              Claims
            </Text>
            <Text size="sm" c='gray.8'>
              ›
            </Text>
            <Text size="sm" c="gray.8">
              Action Needed
            </Text>
          </div>

          <Text component="h1" size="2rem" fw={700} c="dark" lh="1" mb="xl">
            {claim.claimNumber}
          </Text>

          <div className="mb-4">
            <div className="grid grid-cols-6 gap-6 mb-4">
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                TYPE
              </Text>
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                RO NUMBER
              </Text>
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                DATE
              </Text>
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                CLIENT
              </Text>
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                ASSIGNED TO
              </Text>
              <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                CURRENT ODO
              </Text>
            </div>

            <div className="grid grid-cols-6 gap-6 mb-8 pb-8 border-b border-gray-200">
              <Text fw={400} className="text-gray-900">
                {claim.type}
              </Text>
              <Text fw={400} className="text-gray-900">
                {claim.policyNumber}
              </Text>
              <Text fw={400} className="text-gray-900">
                {formatDate(claim.date)}
              </Text>

              <Group gap={4}>
                <Avatar size={20} radius="xl" />
                <Text fw={400} className="text-gray-900">
                  {claim.client}
                </Text>
              </Group>

              <Group gap={4}>
                <Avatar size={20} radius="xl" />
                <Text fw={400} className="text-gray-900">
                  {claim.assignedTo}
                </Text>
              </Group>

              <Text fw={500} className="text-gray-900">
                {claim.currentOdo} ml.
              </Text>
            </div>
          </div>

          <Card withBorder radius="md" shadow="sm" className="mb-4" p="0">
            {/* Headers with padding and border */}
            <div className="px-4 pt-4 pb-2 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-6">
                <Text size="xs" className="text-gray-600 font-semibold uppercase tracking-wide">
                  STATUS
                </Text>
                <Text size="xs" className="text-gray-600 font-semibold uppercase tracking-wide">
                  DETAILS
                </Text>
                <Text size="xs" className="text-gray-600 font-semibold uppercase tracking-wide text-right">
                  ADDITIONAL / ACTIONS
                </Text>
              </div>
            </div>

            {/* Status rows */}
            <div className="space-y-0">
              {statusHistory.map((item, index) => {
                const itemStatusLower = item.status.toLowerCase()
                const badgeColor = item.color || (itemStatusLower === "authorized" ? "teal" : itemStatusLower === "paid" ? "green" : "orange")

                return (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-6 py-5 px-4 border-b border-gray-200 last:border-b-0 bg-white hover:bg-gray-50"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center">
                      <Badge
                        size="md"
                        variant="dot"
                        className="text-sm font-medium"
                        color={badgeColor}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Amount and datetime */}
                    <div>
                      <Text fw={600} className="text-gray-900">
                        ${item.amount.toFixed(2)}
                      </Text>
                      <Text size="xs" className="text-gray-500 mt-1">
                        {formatDateTime(item.timestamp)}
                      </Text>
                    </div>

                    {/* Action button or text */}
                    <div className="flex items-center justify-end">
                      {itemStatusLower === "authorized" ? (
                        <Button
                          unstyled
                          size="sm"
                          className="bg-black hover:bg-gray-800 text-white rounded-full px-5 py-2 font-medium border-0 text-sm"
                          onClick={() => setDrawerOpened(true)}
                        >
                          Submit for payment
                        </Button>
                      ) : itemStatusLower === "paid" ? (
                        <Text size='sm' className="text-green-600 font-medium">
                          Paid
                        </Text>
                      ) : (
                        <Text size='sm' className="text-gray-600">
                          Approx. to approve: 1 business day
                        </Text>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <ClaimSections
            claim={claim}
            onSubmitPayment={handleSubmitPayment}
            drawerOpened={drawerOpened}
            setDrawerOpened={setDrawerOpened}
            invoiceTotal={invoiceTotal}
            claimId={claim._id}
          />

          {/* Single Shared Drawer */}
          <SubmitPaymentDrawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            invoiceTotal={invoiceTotal}
            id={claim._id}
            onSubmit={handleSubmitPayment}
          />
        </div>
      </div>
    </div>
  )
}