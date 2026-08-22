import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Select,
  Group,
  Table,
  Title,
  Text,
  ActionIcon,
  Paper,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconRefresh, IconTrash, IconUsers } from '@tabler/icons-react';

interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
}

const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/users`;

export const UserCrud: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error al obtener usuarios:', error.message);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'No se pudo conectar con el backend',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data: User[] = await response.json();
        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error en carga inicial:', error.message);
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCreateModal = () => {
    setName('');
    setEmail('');
    setRole('user');
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        notifications.show({
          color: 'green',
          title: 'Usuario creado',
          message: `${name} fue agregado correctamente`,
        });
        await fetchUsers();
      } else {
        const data = await response.json().catch(() => ({}));
        notifications.show({
          color: 'red',
          title: 'No se pudo crear',
          message: data.message ?? 'Error al crear el usuario',
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error al crear usuario:', error.message);
      notifications.show({
        color: 'red',
        title: 'Error de red',
        message: 'No se pudo contactar al servidor',
      });
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notifications.show({ color: 'green', message: 'Usuario eliminado' });
        await fetchUsers();
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error al eliminar usuario:', error.message);
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Group>
          <IconUsers size={32} />
          <div>
            <Title order={2}>Gestión de Usuarios</Title>
            <Text size="sm" c="dimmed">
              Administra los registros almacenados en la base de datos PostgreSQL.
            </Text>
          </div>
        </Group>
        <Group>
          <ActionIcon variant="default" size="lg" onClick={fetchUsers} loading={loading}>
            <IconRefresh size={18} />
          </ActionIcon>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreateModal}>
            Nuevo Usuario
          </Button>
        </Group>
      </Group>

      <Paper className="glass-card" p="md">
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Correo</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id} className="user-row">
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.role ?? 'user'}</Table.Td>
                <Table.Td>
                  {user.id && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDeleteUser(user.id!)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
            {users.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center" py="md">
                    No hay usuarios registrados todavía.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Usuario"
        centered
      >
        <form onSubmit={handleCreateUser}>
          <TextInput
            label="Nombre Completo"
            placeholder="Maria Garcia"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            mb="sm"
          />
          <TextInput
            label="Correo Electrónico"
            placeholder="maria@ejemplo.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            mb="sm"
          />
          <Select
            label="Rol"
            data={[
              { value: 'user', label: 'Usuario Standard' },
              { value: 'admin', label: 'Administrador' },
            ]}
            value={role}
            onChange={(value) => setRole(value ?? 'user')}
            mb="md"
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Usuario</Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};