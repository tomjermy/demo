<template>
  <div id="app" class="container">
    <div class="rule-container">
      <div class="rule-header">
        <div class="rule-type">
          <label>策略规则：</label>
          <div class="rule-radios">
            <div class="rule-radio">
              <input type="radio" id="any" value="OR" v-model="ruleData.logic">
              <label for="any">满足以下任意条件时生效</label>
            </div>
            <div class="rule-radio">
              <input type="radio" id="all" value="AND" v-model="ruleData.logic">
              <label for="all">满足全部条件时生效</label>
            </div>
          </div>
        </div>
      </div>
      <div style="display: block">
        <div style="display: flex; height: 400px; overflow: scroll">
          <div style="line-height: 400px; align-items: center; justify-content: center">
            <div style="height: 40px">{{ ruleData.logic }}</div>
          </div>
          <!-- 主条件组 -->
          <div class="condition-group">
            <div class="group-logic">
              条件逻辑: {{ ruleData.logic === 'AND' ? '满足全部条件' : '满足任意条件' }}
            </div>
            
            <div v-for="(condition, index) in ruleData.conditions" :key="condition.id || index" class="condition-row">
              <span class="logic-label" v-if="index > 0">{{ ruleData.logic }}</span>
              
              <!-- 嵌套条件组 -->
              <div class="nested-group" v-if="condition.logic">
                <div class="condition-header">
                  <span class="condition-title">分支条件组: 满足以下{{ condition.logic === 'OR' ? '任意' : '全部' }}条件时生效</span>
                  <button @click="removeNestedCondition(index)" class="btn btn-danger">删除分支条件组</button>
                </div>
                
                <div class="group-logic">
                  条件逻辑: {{ condition.logic === 'AND' ? '满足全部条件' : '满足任意条件' }}
                </div>
                
                <div v-for="(nestedCondition, nestedIndex) in condition.conditions" :key="nestedCondition.id || nestedIndex" class="condition-row">
                  <span class="logic-label" v-if="nestedIndex > 0">{{ condition.logic }}</span>
                  
                  <div class="condition-item">
                    <select v-model="nestedCondition.field">
                      <option v-for="field in fields" :value="field.value">{{ field.label }}</option>
                    </select>
                    
                    <select v-model="nestedCondition.operator">
                      <option v-for="op in operators" :value="op.value">{{ op.label }}</option>
                    </select>
                    
                    <!-- 多值输入 -->
                    <div class="tag-container" v-if="nestedCondition.operator === 'in' || nestedCondition.operator === 'notIn'">
                      <div v-for="(value, idx) in nestedCondition.values" :key="idx" class="tag">
                        {{ value }}
                        <span @click="removeNestedValue(condition, nestedIndex, idx)" class="remove-tag">×</span>
                      </div>
                      <input 
                        type="text" 
                        v-model="nestedCondition.newValue" 
                        @keyup.enter="addNestedValue(condition, nestedIndex)"
                        placeholder="输入值后按回车"
                        style="min-width: 150px;"
                      >
                    </div>
                    
                    <!-- 单值输入 -->
                    <template v-else>
                      <input 
                        type="text" 
                        v-model="nestedCondition.value" 
                        v-if="nestedCondition.operator !== 'date'"
                        placeholder="输入值"
                      >
                      <input 
                        type="date" 
                        v-model="nestedCondition.value" 
                        v-else
                      >
                    </template>
                    
                    <button @click="removeNestedConditionItem(index, nestedIndex)" class="btn btn-danger">删除</button>
                  </div>
                </div>
                
                <button @click="addNestedConditionItem(index)" class="btn btn-outline add-condition">
                  + 添加分支条件
                </button>
              </div>
              
              <!-- 普通条件 -->
              <div class="condition-item" v-else>
                <select v-model="condition.field">
                  <option v-for="field in fields" :value="field.value">{{ field.label }}</option>
                </select>
                
                <select v-model="condition.operator">
                  <option v-for="op in operators" :value="op.value">{{ op.label }}</option>
                </select>
                
                <!-- 多值输入 -->
                <div class="tag-container" v-if="condition.operator === 'in' || condition.operator === 'notIn'">
                  <div v-for="(value, idx) in condition.values" :key="idx" class="tag">
                    {{ value }}
                    <span @click="removeValue(condition, idx)" class="remove-tag">×</span>
                  </div>
                  <input 
                    type="text" 
                    v-model="condition.newValue" 
                    @keyup.enter="addValue(condition)"
                    placeholder="输入值后按回车"
                    style="min-width: 150px;"
                  >
                </div>
                
                <!-- 单值输入 -->
                <template v-else>
                  <input 
                    type="text" 
                    v-model="condition.value" 
                    v-if="condition.operator !== 'date'"
                    placeholder="输入值"
                  >
                  <input 
                    type="date" 
                    v-model="condition.value" 
                    v-else
                  >
                </template>
                
                <button @click="removeCondition(index)" class="btn btn-danger">删除</button>
              </div>
            </div>
            
            <div class="group-actions">
              <button @click="addCondition" class="btn btn-outline">
                + 添加条件
              </button>
            </div>
          </div>
        </div>
        <button @click="addNestedCondition" class="btn btn-primary">
          + 添加条件组
        </button>
      </div>

    </div>
    <div class="data-preview">
      <h2>规则数据预览</h2>
      <pre>{{ JSON.stringify(ruleData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
setup() {
  // 规则数据
  const ruleData = reactive({
    logic: "AND",
    conditions: [
      {
        id: generateId(),
        field: "buTag",
        operator: "in",
        values: ["快消零售KA", "教育培训KA"],
        newValue: ""
      },
      {
        id: generateId(),
        field: "shopId",
        operator: "in",
        values: ["appxxx", "appyyy", "appzzz"],
        newValue: ""
      },
      {
        id: generateId(),
        logic: "OR",
        conditions: [
          {
            id: generateId(),
            field: "shopVersion",
            operator: "equals",
            value: "试用版"
          },
          {
            id: generateId(),
            field: "shopCreateTime",
            operator: "gte",
            value: "2024-01-01"
          }
        ]
      }
    ]
  });
  
  // 可用字段列表
  const fields = ref([
    { label: '店铺BU标签', value: 'buTag' },
    { label: '店铺ID', value: 'shopId' },
    { label: '店铺版本', value: 'shopVersion' },
    { label: '店铺创建时间', value: 'shopCreateTime' }
  ]);
  
  // 可用操作符
  const operators = ref([
    { label: '包含', value: 'in' },
    { label: '不包含', value: 'notIn' },
    { label: '等于', value: 'equals' },
    { label: '不等于', value: 'notEquals' },
    { label: '大于', value: 'gt' },
    { label: '大于等于', value: 'gte' },
    { label: '小于', value: 'lt' },
    { label: '小于等于', value: 'lte' }
  ]);
  
  // 生成唯一ID
  function generateId() {
    return Date.now() + Math.random().toString(16).slice(2);
  }
  
  // 添加条件
  const addCondition = () => {
    ruleData.conditions.push({
      id: generateId(),
      field: 'shopVersion',
      operator: 'equals',
      value: '',
      values: [],
      newValue: ''
    });
  };
  
  // 删除条件
  const removeCondition = (index) => {
    ruleData.conditions.splice(index, 1);
  };
  
  // 添加嵌套条件组
  const addNestedCondition = () => {
    ruleData.conditions.push({
      id: generateId(),
      logic: "OR",
      conditions: [
        {
          id: generateId(),
          field: 'shopVersion',
          operator: 'equals',
          value: '试用版'
        }
      ]
    });
  };
  
  // 删除嵌套条件组
  const removeNestedCondition = (index) => {
    ruleData.conditions.splice(index, 1);
  };
  
  // 添加嵌套条件项
  const addNestedConditionItem = (index) => {
    ruleData.conditions[index].conditions.push({
      id: generateId(),
      field: 'shopVersion',
      operator: 'equals',
      value: '',
      values: [],
      newValue: ''
    });
  };
  
  // 删除嵌套条件项
  const removeNestedConditionItem = (parentIndex, conditionIndex) => {
    ruleData.conditions[parentIndex].conditions.splice(conditionIndex, 1);
  };
  
  // 为多值字段添加值
  const addValue = (condition) => {
    if (condition.newValue.trim()) {
      if (!condition.values) condition.values = [];
      condition.values.push(condition.newValue.trim());
      condition.newValue = '';
    }
  };
  
  // 为嵌套多值字段添加值
  const addNestedValue = (condition, conditionIndex) => {
    const nestedCondition = condition.conditions[conditionIndex];
    if (nestedCondition.newValue.trim()) {
      if (!nestedCondition.values) nestedCondition.values = [];
      nestedCondition.values.push(nestedCondition.newValue.trim());
      nestedCondition.newValue = '';
    }
  };
  
  // 删除多值字段中的值
  const removeValue = (condition, valueIndex) => {
    condition.values.splice(valueIndex, 1);
  };
  
  // 删除嵌套多值字段中的值
  const removeNestedValue = (condition, conditionIndex, valueIndex) => {
    condition.conditions[conditionIndex].values.splice(valueIndex, 1);
  };
  
  return {
    ruleData,
    fields,
    operators,
    addCondition,
    removeCondition,
    addNestedCondition,
    removeNestedCondition,
    addNestedConditionItem,
    removeNestedConditionItem,
    addValue,
    addNestedValue,
    removeValue,
    removeNestedValue
  };
}
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
}
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}
.rule-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.rule-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.rule-type {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.rule-type label {
  margin-right: 10px;
  font-weight: 600;
}
.rule-radios {
  display: flex;
  gap: 15px;
}
.rule-radio {
  display: flex;
  align-items: center;
  gap: 5px;
}
.condition-group {
  background: #fff;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #eaeaea;
}
.condition-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}
.condition-title {
  font-weight: 600;
  margin-right: 15px;
}
.condition-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  flex-wrap: wrap;
}
.condition-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
}
select, input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
}
.or-label {
  background: #e3f2fd;
  color: #1565c0;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  margin-right: 10px;
}
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.btn-primary {
  background-color: #3498db;
  color: white;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.btn-success {
  background-color: #2ecc71;
  color: white;
}
.btn-success:hover {
  background-color: #27ae60;
}
.btn-danger {
  background-color: #e74c3c;
  color: white;
}
.btn-danger:hover {
  background-color: #c0392b;
}
.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}
.btn-outline:hover {
  background: #f5f5f5;
}
.add-condition {
  margin-top: 15px;
}
.data-preview {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 14px;
}
.field-input {
  display: flex;
  align-items: center;
  gap: 5px;
}
.remove-tag {
  cursor: pointer;
  color: #999;
  font-size: 16px;
  margin-left: 5px;
}
.remove-tag:hover {
  color: #e74c3c;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}
.tag {
  background: #e3f2fd;
  color: #1565c0;
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
</style>

