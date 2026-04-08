// src/pages/dashboard/Users/components/ResetPasswordModal.jsx
import { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { Key, Copy, RefreshCw } from "lucide-react";
import Button from "../../../../components/common/Button";

const ResetPasswordModal = ({ open, onCancel, onSubmit, loading, user }) => {
  const [form] = Form.useForm();
  const [generatedPassword, setGeneratedPassword] = useState("");

  // توليد كلمة مرور عشوائية
  const generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    form.setFieldsValue({ password });
  };

  // نسخ كلمة المرور
  const copyPassword = () => {
    const password = form.getFieldValue("password");
    if (password) {
      navigator.clipboard.writeText(password);
      message.success("تم نسخ كلمة المرور");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values.password);
      form.resetFields();
      setGeneratedPassword("");
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setGeneratedPassword("");
    onCancel();
  };

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <Key size={20} className="text-primary" />
          إعادة تعيين كلمة المرور
        </span>
      }
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="إعادة تعيين"
      cancelText="إلغاء"
      confirmLoading={loading}
      width={450}
    >
      <div className="py-4">
        <p className="text-gray-600 mb-4">
          إعادة تعيين كلمة المرور للمستخدم: <strong>{user?.name}</strong>
        </p>

        <Form form={form} layout="vertical">
          <Form.Item
            name="password"
            label="كلمة المرور الجديدة"
            rules={[
              { required: true, message: "كلمة المرور مطلوبة" },
              { min: 8, message: "يجب أن تكون 8 أحرف على الأقل" },
            ]}
          >
            <Input.Password placeholder="أدخل كلمة المرور الجديدة" />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generatePassword}
              className="flex-1"
            >
              <RefreshCw size={14} />
              توليد كلمة مرور
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyPassword}
            >
              <Copy size={14} />
              نسخ
            </Button>
          </div>
        </Form>

        <p className="text-sm text-gray-500 mt-4">
          سيتم إرسال كلمة المرور الجديدة إلى بريد المستخدم: {user?.email}
        </p>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
