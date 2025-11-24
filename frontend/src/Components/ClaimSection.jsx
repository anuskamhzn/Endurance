// Updated ClaimSection.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Text,
  Group,
  Avatar,
  Textarea,
  Button,
  Tabs,
  ActionIcon,
  Paper,
  SimpleGrid,
  Stack,
  Badge,
} from "@mantine/core";
import { IconUpload, IconMessageCircle, IconFileText } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import SubmitPaymentDrawer from "./SubmitPaymentDrawer";

export default function ClaimSections({ 
  claim, 
  onSubmitPayment, 
  drawerOpened, 
  setDrawerOpened, 
  invoiceTotal, 
  claimId 
}) {
  const [activeTab, setActiveTab] = useState("actions");
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionsRef = useRef([]);

  // Safely extract data from claim (with fallbacks)
  const sublets = claim?.sublets || [];
  const services = claim?.services || [];
  const totals = claim?.totals || {};
  const otherDetails = claim?.otherDetails || [];
  const customer = claim?.customer || {};

  // Compute for sticky button
  const hasAuthorized = claim?.statusHistory?.some(item => item.status.toLowerCase() === 'authorized') || false;
  const isPaid = claim?.payment?.status === 'paid' || false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveTab(id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const tabs = [
    { value: "actions", label: "Actions" },
    { value: "sublets", label: "Sublets" },
    { value: "services", label: "Services" },
    { value: "totals", label: "Totals" },
    { value: "other", label: "Other" },
  ];

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    const abs = Math.abs(amount);
    const formatted = `$${abs.toFixed(2)}`;
    return amount < 0 ? `-${formatted}` : formatted;
  };

  return (
    <div>
      {/* Sticky Navbar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 flex justify-between items-center px-8 py-4">
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          classNames={{
            list: "flex justify-start space-x-1 border-0",
            tab: "px-4 py-2 text-sm font-medium relative data-[active=true]:text-black-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black-600 data-[active=false]:after:hidden",
          }}
        >
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        {isScrolled && (
          hasAuthorized && !isPaid ? (
            <Button
              unstyled
              size="sm"
              className="bg-black hover:bg-gray-800 text-white rounded-full px-5 py-2 font-medium text-sm"
              onClick={() => setDrawerOpened(true)}
            >
              Submit for payment
            </Button>
          ) : isPaid ? (
            <Text fw={500} c="green" className="text-sm">
              Paid
            </Text>
          ) : null
        )}
      </div>

      {/* Sections */}
      <div className="px-8 py-6">
        {/* Actions: Chat, Notes, Files */}
        <section id="actions" ref={(el) => (sectionsRef.current[0] = el)}>
          <div className="flex gap-6 mb-8">
            {/* Support Chat */}
            <Paper shadow="xs" p="md" radius="md" withBorder className="flex-1">
              <Group justify="apart" mb="xs">
                <Group gap="xs">
                  <Avatar size={32} />
                  <Text size="sm" fw={500}>Support Chat</Text>
                </Group>
                <ActionIcon variant="subtle" size="sm">
                  <IconMessageCircle size={16} />
                </ActionIcon>
              </Group>
              <div className="h-32 mb-3 overflow-y-auto text-sm text-gray-500 italic">
                Do you have any questions or additional notes about this claim? Write it here.
              </div>
              <Group gap="xs">
                <Textarea placeholder="Type your message..." size="sm" className="flex-1" autosize minRows={1} />
                <Button size="sm" variant="light">Send</Button>
              </Group>
            </Paper>

            {/* Notes */}
            <Paper shadow="xs" p="md" radius="md" withBorder className="w-80">
              <Text size="sm" fw={500} mb="xs">Notes</Text>
              <Textarea
                placeholder="You can write any notes here."
                size="sm"
                autosize
                minRows={4}
                defaultValue={claim?.notes || ""}
              />
            </Paper>

            {/* Files */}
            <Paper shadow="xs" p="md" radius="md" withBorder className="w-80">
              <Text size="sm" fw={500} mb="xs">Files</Text>
              <Dropzone
                onDrop={(files) => console.log("Uploaded:", files)}
                onReject={(files) => console.log("Rejected:", files)}
                maxSize={10 * 1024 ** 2}
              >
                <Group justify="center" direction="column" spacing="xs" style={{ minHeight: 120, pointerEvents: "none" }}>
                  <Dropzone.Idle>
                    <IconFileText size={50} stroke={1.5} />
                  </Dropzone.Idle>
                  <Dropzone.Accept>
                    <IconUpload size={50} stroke={1.5} color="green" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconUpload size={50} stroke={1.5} color="red" />
                  </Dropzone.Reject>
                  <Text size="sm" inline align="center">
                    Drag files here or click to upload
                  </Text>
                </Group>
              </Dropzone>
            </Paper>
          </div>
        </section>

        {/* Sublets */}
        <section id="sublets" ref={(el) => (sectionsRef.current[1] = el)} className="mb-12">
          <Text size="lg" fw={600} mb="md">
            Sublets ${totals.subletTotal?.toFixed(2) || "0.00"}
          </Text>
          <Paper withBorder radius="md" shadow="sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Name of the Sublet</th>
                  <th className="text-center p-4 font-semibold">Qty</th>
                  <th className="text-center p-4 font-semibold">Cost Per</th>
                  <th className="text-right p-4 font-semibold">Requested</th>
                </tr>
              </thead>
              <tbody>
                {sublets.length > 0 ? (
                  sublets.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-4">{item.name}</td>
                      <td className="text-center p-4">{item.qty}</td>
                      <td className="text-center p-4">{formatCurrency(item.costPer)}</td>
                      <td className="text-right p-4">{formatCurrency(item.requested)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">
                      No sublets added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Paper>
        </section>

        {/* Services */}
        <section id="services" ref={(el) => (sectionsRef.current[2] = el)} className="mb-12">
          <Text size="lg" fw={600} mb="md">
            Services ${services.reduce((sum, s) => sum + (s.cost || 0), 0).toFixed(2)}
          </Text>
          <Paper withBorder radius="md" shadow="sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-right p-4 font-semibold">Cost</th>
                  <th className="text-right p-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((item, i) => (
                    <tr key={i} className={i > 0 ? "border-t" : ""}>
                      <td className="p-4">{item.description || item.title}</td>
                      <td className="text-right p-4">{formatCurrency(item.cost)}</td>
                      <td className="text-right p-4 text-sm text-gray-600 underline decoration-dotted">
                        {item.notes || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-8 text-gray-500">
                      No services added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Paper>
        </section>

        {/* Totals */}
        <section id="totals" ref={(el) => (sectionsRef.current[3] = el)} className="mb-12">
          <Text size="lg" fw={600} mb="md">Totals</Text>
          <Paper withBorder radius="md" shadow="sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">TOTAL</th>
                  <th className="text-right p-4 font-semibold">REQUESTED</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-4">Parts Total</td><td className="text-right p-4">{formatCurrency(totals.parts)}</td></tr>
                <tr className="border-t"><td className="p-4">Labor Total</td><td className="text-right p-4">{formatCurrency(totals.labor)}</td></tr>
                <tr className="border-t"><td className="p-4">Sublet Total</td><td className="text-right p-4">{formatCurrency(totals.subletTotal)}</td></tr>
                <tr className="border-t font-bold"><td className="p-4">Subtotal</td><td className="text-right p-4">{formatCurrency(totals.subtotal)}</td></tr>
                <tr className="border-t"><td className="p-4">Taxes</td><td className="text-right p-4">{formatCurrency(totals.taxes)}</td></tr>
                <tr className="border-t"><td className="p-4">Deductible for customer</td><td className="text-right p-4">{formatCurrency(totals.deductible)}</td></tr>
                <tr className="border-t font-bold text-lg"><td className="p-4">Total</td><td className="text-right p-4">{formatCurrency(totals.total)}</td></tr>
              </tbody>
            </table>
          </Paper>
        </section>

        {/* Other Details */}
        <section id="other" ref={(el) => (sectionsRef.current[4] = el)} className="mb-12">
          <Text size="lg" fw={600} mb="md">Other details</Text>
          <SimpleGrid cols={4} spacing="lg">
            {otherDetails.length > 0 ? (
              otherDetails.map((item, i) => (
                <Paper key={i} shadow="xs" p="md" radius="md" withBorder>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">{item.label}</Text>
                    <Text size="sm" fw={500}>{item.value}</Text>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Text c="dimmed">No additional details</Text>
            )}
          </SimpleGrid>
        </section>

        {/* Customer Card */}
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <div className="grid grid-cols-4 gap-6">
            <div className="row-span-2 flex flex-col items-start gap-2">
              <Avatar size={48} />
              <Text size="sm" fw={500}>{customer.name || "N/A"}</Text>
              <Badge color="green" variant="filled" size="sm">
                {customer.status || "Active"}
              </Badge>
            </div>

            <div><Text size="sm" c="dimmed">CONTRACT</Text><Text size="sm" pt="sm">{customer.contract || "-"}</Text></div>
            <div><Text size="sm" c="dimmed">DEDUCTIBLE</Text><Text size="sm" pt="sm">{formatCurrency(customer.deductible)}</Text></div>
            <div><Text size="sm" c="dimmed">VEHICLE</Text><Text size="sm" pt="sm">{customer.vehicle || "-"}</Text></div>
            <div><Text size="sm" c="dimmed">TOTAL CLAIMS</Text><Text size="sm" pt="sm">{customer.totalClaims || 0}</Text></div>
            <div><Text size="sm" c="dimmed">TERM</Text><Text size="sm" pt="sm">{customer.term || "-"}</Text></div>
            <div><Text size="sm" c="dimmed">VIN</Text><Text size="sm" pt="sm">{customer.vin || "-"}</Text></div>
          </div>
        </Paper>
      </div>

      {/* No local drawer here—managed by parent */}
    </div>
  );
}