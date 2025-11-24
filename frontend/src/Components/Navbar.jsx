import { Box, Button, Group, Avatar, Text } from "@mantine/core"
import "@mantine/core/styles.css"

const Navbar = () => {
  return (
    <Box
      component="nav"
      className="bg-gray-100  px-8 py-4 flex items-center justify-between"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <Box className="w-8 h-8 bg-black flex items-center justify-center rounded text-white font-bold text-sm">
        E
      </Box>

      {/* Navigation Links */}
      <Group gap="xl" className="flex-1 ml-40">
        <Text
          size="md"
          fw={500}
          c="gray.5"
          className="hover:text-gray-900 cursor-pointer transition-colors"
        >
          Home
        </Text>
        <Text
          size="md"
          fw={600}
          c="gray.9"
          className="cursor-pointer"
        >
          Claims
        </Text>
        <Text
          size="md"
          fw={500}
          c="gray.5"
          className="hover:text-gray-900 cursor-pointer transition-colors"
        >
          Messages
        </Text>
      </Group>

      {/* Right Side: Profile and New Button */}
      <Group gap="md" align="center">
        <Group gap="xs" align="center">
          <Avatar
            size="sm"
            src="https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=AJ"
            alt="Andy J."
          />
          <Box>
            <Text size="sm" fw={600} c="dark">
              Andy J.
            </Text>
            <Text size="xs" c="gray.6">
              Ford Service
            </Text>
          </Box>
        </Group>

        <Button
          unstyled
          size="sm"
          className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-1.5 font-medium text-sm border-0"
        >
          + New
        </Button>
      </Group>
    </Box>
  )
}

export default Navbar