package com.vaayu.OrderInvertory.Coder;

import java.util.ArrayList;
import java.util.List;

public class Problem2 {
    public static void main(String[] args) {
        int num[] = {-1,1,2,3,1};
        int target = 2;

        List<Integer> nums= new ArrayList<>();

        for(int x: num){
            nums.add(x);
        }



        int count=0;
        for(int i=0;i<nums.size();i++){
            for(int j=1;j<nums.size();j++){
                if(nums.get(i)+nums.get(j)<target){
                    count++;
                }

            }
        }
        System.out.println(count);












    }
}
