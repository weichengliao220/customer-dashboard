import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { fakerJA as faker } from "@faker-js/faker"; // Import Japanese locale
import { Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Box, Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, AppBar, Toolbar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const generateCustomers = (count = 15, category) => {
  const firstNames = [
    "Shohei", "Haruto", "Riku", "Daiki", "Yuto",
    "Souta", "Ren", "Kaito", "Shun", "Ryota"
  ];

  const lastNames = [
    "Tanaka", "Yamamoto", "Kobayashi", "Nakamura", "Fujimoto",
    "Sakai", "Ishikawa", "Hoshino", "Kawasaki", "Aoki"
  ];

  const companySuffixes = ["株式会社", "有限会社", "合同会社"];

  return Array.from({ length: count }, (_, id) => {
    const firstName = faker.helpers.arrayElement(firstNames);
    const lastName = faker.helpers.arrayElement(lastNames);
    const fullName = `${firstName} ${lastName}`;

    const domains = ["yahoo.com", "hotmail.com", "gmail.com", "outlook.com", "icloud.com"];
    const email = `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${faker.helpers.arrayElement(domains)}`;

    const phonePrefixes = ["070", "080", "090"];
    const phone = faker.helpers.arrayElement(phonePrefixes) + "-" +
                  faker.number.int({ min: 1000, max: 9999 }) + "-" +
                  faker.number.int({ min: 1000, max: 9999 });

    const companyName = `${faker.company.name().replace(/株式会社|有限会社|合同会社/g, '')}${faker.helpers.arrayElement(companySuffixes)}`;

    return {
      id: id + 1,
      name: fullName, // Shohei Tanaka
      email: email, // shohei_tanaka@yahoo.com
      phone: phone, // 090-1234-5678
      company: companyName, // Random Japanese company name
      registered: faker.date.past().toISOString().split("T")[0], // Random past date
      category: category, // Specified category
    };
  });
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const CustomerList = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState({ "アクティブ顧客": [], "潜在顧客": [], "過去の顧客": [] });
  const [sortOrder, setSortOrder] = useState("oldest");
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "" });
  const [errors, setErrors] = useState({ firstName: false, lastName: false, email: false, phone: false, company: false });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    setCustomers({
      "アクティブ顧客": generateCustomers(15, "アクティブ顧客"),
      "潜在顧客": generateCustomers(15, "潜在顧客"),
      "過去の顧客": generateCustomers(15, "過去の顧客"),
    });
  }, []);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCustomer({ firstName: "", lastName: "", email: "", phone: "", company: "" });
    setErrors({ firstName: false, lastName: false, email: false, phone: false, company: false });
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10,11}$/;
    const newErrors = {
      firstName: newCustomer.firstName === "",
      lastName: newCustomer.lastName === "",
      email: !/\S+@\S+\.\S+/.test(newCustomer.email),
      phone: !phoneRegex.test(newCustomer.phone.replace(/-/g, "")),
      company: newCustomer.company === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const handleAddCustomer = () => {
    if (!validateForm()) {
      return;
    }
    const category = selectedTab === 0 ? "アクティブ顧客" : selectedTab === 1 ? "潜在顧客" : "過去の顧客";
    const newCustomerWithDate = {
      ...newCustomer,
      firstName: capitalizeFirstLetter(newCustomer.firstName),
      lastName: capitalizeFirstLetter(newCustomer.lastName),
      name: `${capitalizeFirstLetter(newCustomer.firstName)} ${capitalizeFirstLetter(newCustomer.lastName)}`,
      phone: formatPhoneNumber(newCustomer.phone),
      id: customers[category].length + 1,
      registered: new Date().toISOString().split("T")[0],
      category: category,
    };
    setCustomers((prevCustomers) => ({
      ...prevCustomers,
      [category]: [...prevCustomers[category], newCustomerWithDate],
    }));
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCustomerToDelete(null);
  };

  const handleDeleteCustomer = () => {
    const category = customerToDelete.category;
    setCustomers((prevCustomers) => ({
      ...prevCustomers,
      [category]: prevCustomers[category].filter((customer) => customer.id !== customerToDelete.id),
    }));
    handleCloseDeleteDialog();
  };

  const getSortedCustomers = (customers) => {
    return [...customers].sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(b.registered) - new Date(a.registered);
      } else if (sortOrder === "newest") {
        return new Date(a.registered) - new Date(b.registered);
      } else if (sortOrder === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const filteredCustomers = getSortedCustomers(customers[selectedTab === 0 ? "アクティブ顧客" : selectedTab === 1 ? "潜在顧客" : "過去の顧客"]).filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            顧客管理ダッシュボード
          </Typography>
          <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is to offset the fixed AppBar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, width: '100%', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="お名前で検索"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>並び替え</InputLabel>
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="alphabetical">アルファベット順（お名前）</MenuItem>
                <MenuItem value="oldest">新しい順（登録日）</MenuItem>
                <MenuItem value="newest">古い順（登録日）</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="アクティブ顧客" />
              <Tab label="潜在顧客" />
              <Tab label="過去の顧客" />
            </Tabs>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              +
            </Button>
          </Box>
          <Box sx={{ height: '80vh', overflowY: 'auto' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>お名前</strong></TableCell>
                    <TableCell><strong>メールアドレス</strong></TableCell>
                    <TableCell><strong>電話番号</strong></TableCell>
                    <TableCell><strong>会社名</strong></TableCell>
                    <TableCell><strong>登録日</strong></TableCell>
                    <TableCell><strong>削除</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer, index) => (
                    <TableRow key={customer.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.email}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.phone}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.company}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.registered}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDeleteDialog(customer)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>新しい顧客を追加</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="名前（英語）"
                type="text"
                fullWidth
                value={newCustomer.firstName}
                onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                error={errors.firstName}
                helperText={errors.firstName ? "名前は必須です" : ""}
              />
              <TextField
                margin="dense"
                label="苗字（英語）"
                type="text"
                fullWidth
                value={newCustomer.lastName}
                onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                error={errors.lastName}
                helperText={errors.lastName ? "苗字は必須です" : ""}
              />
              <TextField
                margin="dense"
                label="メールアドレス"
                type="email"
                fullWidth
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                error={errors.email}
                helperText={errors.email ? "有効なメールアドレスをご入力ください" : ""}
              />
              <TextField
                margin="dense"
                label="電話番号"
                type="text"
                fullWidth
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                error={errors.phone}
                helperText={errors.phone ? "電話番号は10桁または11桁である必要があります" : ""}
              />
              <TextField
                margin="dense"
                label="会社名"
                type="text"
                fullWidth
                value={newCustomer.company}
                onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                error={errors.company}
                helperText={errors.company ? "会社名は必須です" : ""}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                キャンセル
              </Button>
              <Button onClick={handleAddCustomer} color="primary">
                追加
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>顧客を削除</DialogTitle>
            <DialogContent>
              本当にこの顧客を削除しますか？
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                キャンセル
              </Button>
              <Button onClick={handleDeleteCustomer} color="primary">
                削除
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default CustomerList;
