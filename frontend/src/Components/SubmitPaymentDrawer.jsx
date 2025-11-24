"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Text,
  Group,
  Stack,
  Paper,
  ActionIcon,
  Checkbox,
  Select,
  Center,
  Timeline,
  Title,
  ThemeIcon,
  Loader,
  rem,
  Notification,
} from "@mantine/core";
import {
  IconUpload,
  IconX,
  IconCheck,
  IconPlus,
  IconFileText,
  IconCreditCard,
  IconMessageCircle,
  IconHome,
  IconX as IconClose,
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function SubmitPaymentDrawer({ opened, onClose, invoiceTotal = 0, id, onSubmit }) {
  const [files, setFiles] = useState([]);
  const [allInvoicesProvided, setAllInvoicesProvided] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wire");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  // Trigger the 3D spin exactly once when success screen mounts
  useEffect(() => {
    if (isSubmitted) {
      setTriggerAnimation(true);
    }
  }, [isSubmitted]);

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setError(null);
  };

  const removeFile = () => setFiles([]);

  const handleSubmit = async () => {
    if (!allInvoicesProvided || files.length === 0) {
      setError("Please provide all required information and upload an invoice.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('paymentFile', files[0]);
      formData.append('paymentMethod', paymentMethod);

      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to submit payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsProcessing(false);
    setFiles([]);
    setAllInvoicesProvided(false);
    setError(null);
    setTriggerAnimation(false);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      position="right"
      size="lg"
      padding="xl"
      closeButtonProps={{ size: "md" }}
      styles={{ header: { borderBottom: "1px solid #e9ecef" }, body: { paddingTop: 24 } }}
    >
      {/* SUCCESS SCREEN WITH 3D SPINNING CHECKMARK */}
      <AnimatePresence mode="wait">
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ height: "100%" }}
          >
            <Stack h="100%" justify="space-between" align="center">
              <Stack align="center" spacing="xl" mt={rem(60)}>
                {/* 3D Rotating Checkmark */}
                <div style={{ perspective: 1000 }}>
                  <motion.div
                    animate={triggerAnimation ? { rotateY: [0, 360] } : {}}
                    transition={{
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                    onAnimationComplete={() => setTriggerAnimation(false)}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <ThemeIcon
                      size={140}
                      radius="md"
                      color="green"
                      style={{
                        boxShadow: "0 20px 40px rgba(34, 139, 34, 0.3)",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      }}
                    >
                      <IconCheck
                        style={{ width: rem(90), height: rem(90) }}
                        stroke={2.2}
                        color="white"
                      />
                    </ThemeIcon>
                  </motion.div>
                </div>

                <Title order={2} ta="center" fw={700}>
                  You’re all set!
                </Title>

                <Text size="md" c="dimmed" ta="center" maw={440}>
                  Feel free to send us a message with any extra details or files.
                </Text>

                {/* Timeline */}
                <Timeline active={2} bulletSize={30} lineWidth={4} color="green" mt={50}>
                  <Timeline.Item title="Invoice reviewing" />
                  <Timeline.Item title="Payment release" />
                  <Timeline.Item title="Money on your account" />
                </Timeline>

                <Text size="sm" c="dimmed" mt="md">
                  Estimated arrival: 30 July
                </Text>
              </Stack>

              <Group justify="center" mt="xl" pb="lg" gap="md">
                <Button leftSection={<IconMessageCircle size={18} />} variant="default" size="lg">
                  Send message
                </Button>
                <Button
                  leftSection={<IconHome size={18} />}
                  variant="filled"
                  color="dark"
                  size="lg"
                  onClick={handleClose}
                >
                  Back home
                </Button>
              </Group>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM SCREEN */}
      {!isSubmitted && (
        <Stack gap="xl" pos="relative">
          {isProcessing && (
            <Center pos="absolute" inset={0} bg="rgba(255,255,255,0.97)" style={{ zIndex: 10 }}>
              <Stack align="center" gap="md">
                <Loader size="lg" color="green" />
                <Text fw={500}>Processing your submission...</Text>
              </Stack>
            </Center>
          )}

          {error && (
            <Notification icon={<IconClose size={18} />} color="red" title="Error" onClose={() => setError(null)}>
              {error}
            </Notification>
          )}

          <Text size="sm" c="dimmed">
            You need to upload invoice and confirm payment method
          </Text>

          {/* Invoice Total */}
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Group gap="xs">
                <IconCheck size={20} color="var(--mantine-color-green-6)" />
                <Text fw={600}>${invoiceTotal.toFixed(2)}</Text>
              </Group>
              <Text size="sm" c="dimmed">Invoice total</Text>
            </Group>
          </Paper>

          {/* Upload & Rest of Form */}
          <div>
            <Text fw={500} mb="xs">Upload Invoice</Text>
            <Dropzone onDrop={handleDrop} maxSize={4 * 1024 ** 2} multiple={false}>
              <Group justify="center" gap="xl" mih={180} style={{ pointerEvents: "none" }}>
                <Dropzone.Idle>
                  <IconUpload size={50} stroke={1.5} color="var(--mantine-color-blue-6)" />
                </Dropzone.Idle>
                <div>
                  <Text size="sm" inline>
                    Drag and drop your invoice file here<br />
                    or <span style={{ color: "var(--mantine-color-blue-6)", textDecoration: "underline" }}>
                      click here
                    </span>{" "}
                    to upload
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>PDF, JPEG, PNG (Max 4mb)</Text>
                </div>
              </Group>
            </Dropzone>

            {files.map((file, i) => (
              <Group key={i} justify="apart" mt="sm" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                <Group gap="xs">
                  <IconFileText size={16} />
                  <Text size="sm" truncate style={{ maxWidth: 280 }}>{file.name}</Text>
                </Group>
                <ActionIcon size="sm" color="red" variant="subtle" onClick={removeFile}>
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            ))}
          </div>

          <div>
            <Text fw={500} mb="xs">Payment method</Text>
            <Select
              value={paymentMethod}
              onChange={setPaymentMethod}
              data={[
                { value: "wire", label: "Wire Transfer" },
                { value: "ach", label: "ACH Transfer" },
                { value: "check", label: "Check" },
              ]}
              leftSection={<IconCreditCard size={18} />}
            />
            <Text size="xs" c="dimmed" mt={4}>Ending in 9536</Text>
          </div>

          <Checkbox
            label="All related invoices are provided"
            checked={allInvoicesProvided}
            onChange={(e) => setAllInvoicesProvided(e.currentTarget.checked)}
            size="md"
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color="black"
              disabled={!allInvoicesProvided || files.length === 0 || isProcessing}
              onClick={handleSubmit}
            >
              Submit for payment
            </Button>
          </Group>
        </Stack>
      )}
    </Drawer>
  );
}