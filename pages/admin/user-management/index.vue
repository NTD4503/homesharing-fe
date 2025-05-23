<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Quản lý người dùng</h1>
    <br />
    <div class="text-center">
      <span class="text-xl">Số người dùng: {{ users.length }}</span>
    </div>
    <a-space class="flex justify-end">
      <a-button @click="addUserModalVisible = true"
        ><i class="fa fa-plus-circle mr-2" aria-hidden="true"></i> Thêm người
        dùng</a-button
      >
    </a-space>
    <br />
    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :pagination="pagination"
      class="w-full"
    >
      <template slot="index" slot-scope="text, record, index"
        >{{ index + 1 }}
      </template>
      <template slot="service_expiry_date" slot-scope="text">
        {{ formatDate(text) }}
      </template>
      <template slot="created_at" slot-scope="text">
        {{ formatDate(text) }}
      </template>
      <template slot-scope="text, record" slot="userInfo">
        <div class="text-center">
          <a-avatar
            :src="record.avatar"
            v-if="record.avatar"
            :size="50"
            class="cursor-pointer mb-2"
            :class="{ 'border-blue-500': record.avatar }"
            :style="{ 'border-width': record.avatar ? '2px' : '0' }"
          />
          <a-avatar icon="user" v-else :size="50" class="cursor-pointer mb-2" />
          <br />
          <span>{{ record.user_name }}</span>
        </div>
      </template>
      <template slot="is_blocked" slot-scope="text, record">
        <a-tag :color="record.is_blocked ? 'red' : 'green'">
          {{ record.is_blocked ? "Bị chặn" : "Hoạt động" }}
        </a-tag>
      </template>
      <template slot="role_name" slot-scope="text, record">
        {{ translateRole(record.role_name) }}
      </template>
      <template slot="actions" slot-scope="text, record">
        <a-button
          class="mr-2 bg-blue-400 text-white"
          @click="handleEdit(record)"
        >
          <i class="fa fa-edit mr-2"></i> Sửa
        </a-button>
        <a-button
          class="text-white bg-red-400"
          @click="updateBlockedStatus(record)"
        >
          <i
            :class="record.is_blocked ? 'fa fa-unlock mr-2' : 'fa fa-ban mr-2'"
          ></i>
          {{ !record.is_blocked ? "Chặn" : "Bỏ chặn" }}
        </a-button>
      </template>
    </a-table>

    <!-- Popup form for editing user -->
    <a-modal
      title="Chỉnh sửa thông tin người dùng"
      v-model:visible="editUserModalVisible"
      :footer="null"
    >
      <a-form
        v-if="editingUser"
        :model="editingUser"
        ref="editForm"
        @finish="updateUser"
        class="p-4"
      >
        <a-form-item label="Ảnh đại diện" class="text-center">
          <a-upload
            :show-upload-list="false"
            :before-upload="(file) => handleFileUpload(file, 'edit')"
          >
            <a-avatar
              :src="editingUser.avatar"
              v-if="editingUser.avatar"
              :size="100"
              class="cursor-pointer border-2 border-blue-500"
            />
            <a-avatar icon="user" v-else :size="100" class="cursor-pointer" />
          </a-upload>
        </a-form-item>
        <a-form-item
          label="Họ tên"
          name="user_name"
          :rules="[{ required: true, message: 'Please enter user name' }]"
          class="mb-4"
        >
          <a-input v-model="editingUser.user_name" />
        </a-form-item>
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]"
          class="mb-4"
        >
          <a-input v-model="editingUser.email" />
        </a-form-item>
        <a-form-item label="Số điện thoại" name="phone" class="mb-4">
          <a-input v-model="editingUser.phone" />
        </a-form-item>
        <a-form-item label="Loại tài khoản" name="role_name" class="mb-4">
          <a-select v-model="editingUser.role_id">
            <a-select-option
              v-for="role in roles"
              :value="role.role_id"
              :key="role.role_id"
              >{{
                role.role_name === "tenant"
                  ? "Người thuê"
                  : role.role_name === "landlord"
                  ? "Cho thuê"
                  : role.role_name
              }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
      <a-spin :spinning="updatingUser">
        <div class="flex justify-center">
          <a-button @click="cancelEditUser" class="mr-2">Hủy</a-button>
          <a-button @click="updateUser">Lưu</a-button>
        </div>
      </a-spin>
    </a-modal>

    <a-modal
      title="Thêm người dùng mới"
      v-model:visible="addUserModalVisible"
      :footer="null"
    >
      <a-form ref="addForm" @finish="addUserModalVisible = false" class="p-4">
        <!-- Ảnh đại diện -->
        <a-form-item label="Ảnh đại diện" class="text-center">
          <a-upload
            :show-upload-list="false"
            :before-upload="(file) => handleFileUpload(file, 'add')"
          >
            <a-avatar
              :src="newUser.avatar"
              v-if="newUser.avatar"
              :size="100"
              class="cursor-pointer border-2 border-blue-500"
            />
            <a-avatar icon="user" v-else :size="100" class="cursor-pointer" />
          </a-upload>
        </a-form-item>
        <!-- Họ và tên -->
        <a-form-item
          label="Họ tên"
          name="user_name"
          :rules="[
            { required: true, message: 'Vui lòng nhập họ tên người dùng' },
          ]"
          class="mb-4"
        >
          <a-input v-model="newUser.user_name" />
        </a-form-item>
        <!-- Email -->
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
          ]"
          class="mb-4"
        >
          <a-input v-model="newUser.email" />
        </a-form-item>
        <!-- Số điện thoại -->
        <a-form-item label="Số điện thoại" name="phone" class="mb-4">
          <a-input v-model="newUser.phone" />
        </a-form-item>

        <a-form-item label="Mật khẩu" name="password" class="mb-4">
          <a-input-password v-model="newUser.password" />
        </a-form-item>

        <!-- Loại tài khoản -->
        <a-form-item label="Loại tài khoản" name="role_name" class="mb-4">
          <a-select v-model="newUser.role_id">
            <a-select-option
              v-for="role in roles"
              :value="role.role_id"
              :key="role.role_id"
            >
              {{
                role.role_name === "tenant"
                  ? "Người thuê"
                  : role.role_name === "landlord"
                  ? "Chủ nhà"
                  : role.role_name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-spin :spinning="addingUser">
        <div class="flex justify-center">
          <a-button @click="addUserModalVisible = false" class="mr-2"
            >Hủy</a-button
          >
          <a-button @click="handleSaveNewUser">Lưu</a-button>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { message } from "ant-design-vue";
import { columns, pagination } from "./const";
import _ from "lodash";
import moment from "moment";

export default {
  layout: "admin",
  data() {
    return {
      columns,
      pagination,
      editUserModalVisible: false,
      editingUser: null,
      tempAvatar: null,
      updatingUser: false,
      addUserModalVisible: false,
      addingUser: false,
      newUser: {
        avatar: null,
        user_name: "",
        password: "",
        email: "",
        phone: "",
        role_id: null,
      },
    };
  },
  computed: {
    ...mapState({
      users: (state) => state.modules["user"].users,
      currentUser: (state) => state.modules["user"].currentUser,
      roles: (state) => state.modules["user"].roles,
    }),
    dataSource() {
      return this.users;
    },
  },
  async created() {
    await Promise.all([this.fetchAllUsers(), this.fetchAllRoles()]);
    this.columns = this.columns.map((column) => {
      if (column.dataIndex === "role_name") {
        return {
          ...column,
          filters: this.roles.map((role) => ({
            text: role.role_name,
            value: role.role_name,
          })),
        };
      }
      return column;
    });
  },
  methods: {
    ...mapActions({
      fetchAllUsers: "modules/user/fetchAllUsers",
      updateUserBlockedStatus: "modules/user/updateUserBlockedStatus",
      fetchUserById: "modules/user/fetchUserById",
      updateUserForAdmin: "modules/user/updateUserForAdmin",
      fetchAllRoles: "modules/user/fetchAllRoles",
      uploadImage: "modules/upload-image/uploadImage",
      saveUser: "modules/user/saveUser",
    }),

    formatDate(date) {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }
    },

    async handleFileUpload(file, mode) {
      console.log(mode);
      try {
        this.tempAvatar = file;
        if (mode === "edit") {
          this.editingUser.avatar = URL.createObjectURL(file);
        } else {
          this.newUser.avatar = URL.createObjectURL(file);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },

    async handleEdit(user) {
      await this.fetchUserById(user.user_id);
      this.editingUser = _.cloneDeep(this.currentUser);
      this.editUserModalVisible = true;
    },

    async handleSaveNewUser() {
      this.addingUser = true;
      if (this.tempAvatar) {
        let imageUrl = await this.uploadImage(this.tempAvatar);
        this.newUser.avatar = imageUrl;
      }
      await this.saveUser(this.newUser);
      this.addingUser = false;
      message.success("Thêm người dùng thành công!");
      await this.fetchAllUsers();
      this.addUserModalVisible = false;
    },

    async updateBlockedStatus(user) {
      let payload = {
        user_id: user.user_id,
        is_blocked: !user.is_blocked,
      };
      try {
        await this.updateUserBlockedStatus(payload);
        message.success(
          user.is_blocked ? "Bỏ chặn người dùng" : "Chặn người dùng"
        );
        await this.fetchAllUsers();
      } catch (error) {
        message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
      }
    },

    cancelEditUser() {
      this.editUserModalVisible = false;
      this.editingUser = null;
      this.tempAvatar = null;
    },

    async updateUser() {
      try {
        this.updatingUser = true;
        if (this.tempAvatar) {
          let imageUrl = await this.uploadImage(this.tempAvatar);
          this.editingUser.avatar = imageUrl;
        }
        await this.updateUserForAdmin(this.editingUser);
        setTimeout(() => {
          this.cancelEditUser();
        }, 1000);
        message.success("Cập nhật người dùng thành công");
        await this.fetchAllUsers();
      } catch (error) {
        message.error("Cập nhật người dùng thất bại");
      } finally {
        this.updatingUser = false;
      }
    },

    translateRole(roleName) {
      switch (roleName) {
        case "landlord":
          return "Chủ nhà";
        case "tenant":
          return "Người thuê nhà";
        default:
          return roleName;
      }
    },
  },
};
</script>

<style scoped>
.avatar-uploader .ant-upload {
  width: 128px;
  height: 128px;
}

.avatar {
  width: 100%;
  height: 100%;
}

.upload-button {
  width: 128px;
  height: 128px;
  line-height: 128px;
}
</style>
