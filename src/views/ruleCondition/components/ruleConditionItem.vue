<template>
  <!-- 主条件 -->
  <div v-if="!condition.conditions" class="condition-content">
    <div class="left">
      <el-select v-model="condition.field" class="select" placeholder="请选择" @select="handleSelectField">
        <el-option class="option" v-for="it in [{label: '店铺版本', value: 1}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
      <el-select v-model="condition.operator" class="select" placeholder="请选择">
        <el-option class="option" v-for="it in [{label: '等于', value: '='}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
      <el-select v-model="condition.value" class="select" placeholder="请选择">
        <el-option class="option" v-for="it in [{label: '试用版', value: 1}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
    </div>
    <div class="right">
      <el-icon>
        <Delete />
      </el-icon>
    </div>
  </div>
  <!-- 分支条件 -->
  <div v-else></div>
</template>

<script lang="js">
import { Delete } from '@element-plus/icons-vue';

export default {
  name: 'RuleConditionItem',
  components: {
    Delete 
  },
  props: {
    condition: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {};
  },
  data() {
    return {
    }
  },
  methods: {
    handleSelectField(value) {
      this.$emit('update:condition', value);
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

.left {

  .select {
    width: 180px;
    background: #f7f7f7;
    padding: 0 10px;
  }
}

.right {
  margin: 0 10px;
  color: #7f7f7f;
}

.right:hover {
  color: #343434;
}
</style>