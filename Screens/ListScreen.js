import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {theme} from '../assets';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-neat-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  setDB,
  setToken,
  setRefreshing,
  setDate,
  setCommon,
  setDepartments,
} from '../Contains/List';
import {
  Button,
  Box,
  CheckIcon,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  Select,
} from 'native-base';

export default ListScreen = () => {
  const dispatch = useDispatch();
  const {db, token, refreshing, date, common, departments} = useSelector(
    state => state.list,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [departID, setDepartID] = useState();
  const [status, setStatus] = useState();
  const [report, setReport] = useState();
  const [object, setObject] = useState();

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    dispatch(setRefreshing(true));
    _handleSave();
    dispatch(setDate());
    wait(1000).then(() => {
      dispatch(setRefreshing(false));
    });
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onCancel = () => {
    setShowDatePicker(false);
  };

  const onConfirm = async output => {
    setShowDatePicker(false);
    const {startDate, startDateString, endDate, endDateString} = output;
    const start = new Date(startDate);
    const startd = start.getTime() / 1000;
    const end = new Date(endDate);
    const endd = end.getTime() / 1000 + 24 * 60 * 60;

    try {
      let res = await axios.post(
        '/getAllReports',
        {page: '1', reportTime: `${startd},${endd}`},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.data.data;
      dispatch(setDB(data));
    } catch (err) {
      console.log(err);
    }
    dispatch(
      setDate(
        startDateString.split('-').reverse().join('/') +
          ' - ' +
          endDateString.split('-').reverse().join('/'),
      ),
    );
  };

  const _handleSave = async () => {
    const tokenString = await AsyncStorage.getItem('token');
    dispatch(setToken(tokenString));
    await _handleGetData(tokenString);
    await _handleGetCommon(tokenString);
    await _handleGetDepartment(tokenString);
  };

  const _handleGetData = async token => {
    try {
      let res = await axios.post(
        '/getAllReports',
        {page: '1'},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.data.data;
      dispatch(setDB(data));
    } catch (err) {
      console.log(err);
    }
  };
  const _handleGetCommon = async token => {
    try {
      let res = await axios.post(
        '/getCommon',
        {groups: 'incidentObject, reportStatus, reportType'},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.data;
      // console.log(data);
      dispatch(setCommon(data));
    } catch (err) {
      console.log(err);
    }
  };

  const _handleGetDepartment = async token => {
    try {
      let res = await axios.post(
        '/getAllDepartments',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.data.data;
      // console.log(data);
      dispatch(setDepartments(data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    _handleSave();
  }, []);

  const _renderItem = ({item}) => {
    if (common) {
      const {incidentObject, reportStatus, reportType} = common;

      const object =
        incidentObject &&
        incidentObject.filter(val => val.code === item.incidentObject)[0];

      const status =
        reportStatus && reportStatus.filter(val => val.code === item.status)[0];

      const type =
        reportType && reportType.filter(val => val.code === item.reportType)[0];
      var date = new Date(item.reportTime * 1000);
      return (
        <View style={styles.itemBox}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
                {item.reportNo}
              </Text>
              <Text style={styles.styleStatus(item.status)}>{status.name}</Text>
            </View>
            <Text style={{color: theme.COLORS.warmGrey600}}>
              {+date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds()}
            </Text>
            <Text style={{color: theme.COLORS.warmGrey600}}>
              {type.name}|{object.name}
            </Text>
            <Text style={{color: theme.COLORS.warmGrey600}}>
              {item.detector}
            </Text>
            <Text style={{color: theme.COLORS.warmGrey600}}>
              {item.shortDescription}
            </Text>
          </View>
          <Icon
            name="ellipsis-v"
            size={30}
            color="#0A8E9D"
            style={{position: 'absolute', right: 20, top: 40}}
          />
        </View>
      );
    } else {
    }
  };

  const _handleFilter = async () => {
    setShowModal(false);

    const key = ['departmentId', 'status', 'reportType', 'incidentObject'];
    const value = [departID, status, report, object];
    let body = {page: 1};
    for (var i = 0; i <= value.length; i++) {
      if (value != '') body[key[i]] = value[i];
    }

    try {
      let res = await axios.post('/getAllReports', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data.data;
      // console.log(JSON.stringify(data));
      dispatch(setDB(data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: theme.COLORS.warmGrey200,
            height: 70,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderRadius: 7,
              borderColor: '#0A8E9D',
              width: '80%',
              margin: 10,
            }}>
            <TextInput
              value={date}
              editable={false}
              style={{width: '100%', color: 'black', paddingLeft: 20}}
            />
            <Icon
              name="calendar-alt"
              size={25}
              color="#0A8E9D"
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={openDatePicker}
            />
          </View>
          <Icon
            name="filter"
            size={30}
            color="#0A8E9D"
            style={{marginVertical: 18, marginLeft: 10}}
            onPress={() => setShowModal(true)}
          />
          <DatePicker
            isVisible={showDatePicker}
            mode={'range'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </View>
      </RefreshControl>
      <FlatList
        data={db}
        renderItem={common && _renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 60,
          position: 'absolute',
          bottom: 20,
          right: 20,
          height: 60,
          backgroundColor: '#0A8E9D',
          borderRadius: 100,
        }}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      <NativeBaseProvider>
        <Center>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Filter</Modal.Header>
              <Modal.Body>
                <FormControl.Label>Theo phòng ban</FormControl.Label>
                <Box w="3/4" maxW="300">
                  <Select
                    selectedValue={departID}
                    minWidth="200"
                    accessibilityLabel="Chọn phòng ban"
                    placeholder="Chọn phòng ban"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={itemValue => setDepartID(itemValue)}>
                    {departments &&
                      departments.map((val, index) => {
                        return (
                          <Select.Item
                            label={val.departmentName}
                            value={val.id}
                            key={index}
                          />
                        );
                      })}
                  </Select>
                </Box>
                <FormControl.Label>Trạng thái</FormControl.Label>
                <Select
                  selectedValue={status}
                  minWidth="200"
                  accessibilityLabel="Chọn trạng thái"
                  placeholder="Chọn trạng thái"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setStatus(itemValue)}>
                  {common &&
                    common.reportStatus.map((val, index) => {
                      return (
                        <Select.Item
                          label={val.name}
                          value={val.code}
                          key={index}
                        />
                      );
                    })}
                </Select>
                <FormControl.Label>Loại báo cáo</FormControl.Label>
                <Select
                  selectedValue={report}
                  minWidth="200"
                  accessibilityLabel="Chọn loại báo cáo"
                  placeholder="Chọn loại báo cáo"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setReport(itemValue)}>
                  {common &&
                    common.reportType.map((val, index) => {
                      return (
                        <Select.Item
                          label={val.name}
                          value={val.code}
                          key={index}
                        />
                      );
                    })}
                </Select>
                <FormControl.Label>Đối tượng</FormControl.Label>
                <Select
                  selectedValue={object}
                  minWidth="200"
                  accessibilityLabel="Chọn đối tượng"
                  placeholder="Chọn đối tượng"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setObject(itemValue)}>
                  {common &&
                    common.incidentObject.map((val, index) => {
                      return (
                        <Select.Item
                          label={val.name}
                          value={val.code}
                          key={index}
                        />
                      );
                    })}
                </Select>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}>
                    Cancel
                  </Button>
                  <Button onPress={() => _handleFilter()}>Lọc</Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Center>
      </NativeBaseProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.error700,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  styleStatus: i => {
    const colors = ['#6ab04c', '#f9ca24', '#686de0', '#be2edd', '#22a6b3'];
    return {
      marginLeft: 20,
      color: colors[i],
    };
  },
});
