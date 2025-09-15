package com.vaayu.OrderInvertory.Coder;

public class problem1 {
    public static void main(String[] args) {

       String word = "abcdefd", ch = "d";
       

       int index=word.indexOf(ch);
        System.out.println("index = " + index);


        StringBuilder sb= new StringBuilder();
        for(int i=0;i<=index;i++){
            sb.append(word.charAt(i));
        }

        System.out.println("sb = " + sb);
        
        sb.reverse();
        System.out.println("sb = " + sb);
        
        for(int i=index+1;i<word.length();i++){
            sb.append(word.charAt(i));
        }
        System.out.println("sb = " + sb);

        System.out.println(sb.toString());
        
        
        
        
        
        
        
        
        
        
        
    }
}
